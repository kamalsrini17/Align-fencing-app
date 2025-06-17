import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';

// User interface for our application
export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  profile?: {
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    unitSystem?: 'metric' | 'imperial';
    fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
    goals?: string[];
    activityLevel?: string;
  };
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Create a new user account
export const createUser = async (userData: CreateUserData): Promise<AuthResult> => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const firebaseUser = userCredential.user;
    
    // Create user document in Firestore
    const user: User = {
      uid: firebaseUser.uid,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      profile: {
        fitnessLevel: 'beginner',
        unitSystem: 'metric',
        goals: [],
        activityLevel: 'moderately_active'
      }
    };
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), user);
    
    return { success: true, user };
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    let errorMessage = 'Account creation failed. Please try again.';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    }
    
    return { success: false, error: errorMessage };
  }
};

// Authenticate user login
export const authenticateUser = async (email: string, password: string): Promise<AuthResult> => {
  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      return { success: false, error: 'User data not found. Please contact support.' };
    }
    
    const userData = userDoc.data() as User;
    
    return { success: true, user: userData };
  } catch (error: any) {
    console.error('Error signing in:', error);
    
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    }
    
    return { success: false, error: errorMessage };
  }
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    clearUserSession();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// Get current user data from Firestore
export const getCurrentUserData = async (): Promise<User | null> => {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;
    
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) return null;
    
    return userDoc.data() as User;
  } catch (error) {
    console.error('Error getting current user data:', error);
    return null;
  }
};

// Update user data in Firestore
export const updateUserData = async (userData: Partial<User>): Promise<boolean> => {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return false;
    
    const updateData = {
      ...userData,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), updateData, { merge: true });
    
    // Update local session
    const updatedUser = await getCurrentUserData();
    if (updatedUser) {
      setUserSession(updatedUser);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};

// Client-side session management (for immediate UI updates)
export const setUserSession = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getUserSession = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const clearUserSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null || getUserSession() !== null;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // User is signed in, get their data from Firestore
      const userData = await getCurrentUserData();
      if (userData) {
        setUserSession(userData);
        callback(userData);
      } else {
        callback(null);
      }
    } else {
      // User is signed out
      clearUserSession();
      callback(null);
    }
  });
};