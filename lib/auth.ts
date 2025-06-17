// Simple authentication system that works with or without Firebase
// Falls back to mock authentication if Firebase is not configured

import { auth, db, isConfigured } from './firebase';

// Import Firebase functions only if configured
let createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged;
let doc, setDoc, getDoc, serverTimestamp, Timestamp;

if (isConfigured && typeof window !== 'undefined') {
  try {
    const firebaseAuth = require('firebase/auth');
    const firestore = require('firebase/firestore');
    
    createUserWithEmailAndPassword = firebaseAuth.createUserWithEmailAndPassword;
    signInWithEmailAndPassword = firebaseAuth.signInWithEmailAndPassword;
    signOut = firebaseAuth.signOut;
    onAuthStateChanged = firebaseAuth.onAuthStateChanged;
    
    doc = firestore.doc;
    setDoc = firestore.setDoc;
    getDoc = firestore.getDoc;
    serverTimestamp = firestore.serverTimestamp;
    Timestamp = firestore.Timestamp;
  } catch (error) {
    console.warn('Firebase modules not available, falling back to mock auth');
  }
}

// User interface for our application
export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: any;
  updatedAt: any;
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

// Mock users for fallback
const mockUsers: User[] = [
  {
    uid: '1',
    email: 'alex.johnson@example.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    profile: {
      fitnessLevel: 'intermediate',
      unitSystem: 'metric',
      goals: ['weight_loss', 'muscle_gain'],
      activityLevel: 'moderately_active'
    }
  },
  {
    uid: '2',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    profile: {
      fitnessLevel: 'beginner',
      unitSystem: 'metric',
      goals: ['general_fitness'],
      activityLevel: 'lightly_active'
    }
  }
];

const mockPasswords: Record<string, string> = {
  'alex.johnson@example.com': 'password123',
  'demo@example.com': 'demo123'
};

// Create a new user account
export const createUser = async (userData: CreateUserData): Promise<AuthResult> => {
  // Use Firebase if configured
  if (isConfigured && auth && createUserWithEmailAndPassword && setDoc && doc && serverTimestamp) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const firebaseUser = userCredential.user;
      
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
  }
  
  // Fallback to mock authentication
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const existingUser = mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existingUser) {
    return { success: false, error: 'User already exists' };
  }
  
  const newUser: User = {
    uid: Date.now().toString(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: {
      fitnessLevel: 'beginner',
      unitSystem: 'metric',
      goals: [],
      activityLevel: 'moderately_active'
    }
  };
  
  mockUsers.push(newUser);
  mockPasswords[newUser.email] = userData.password;
  
  return { success: true, user: newUser };
};

// Authenticate user login
export const authenticateUser = async (email: string, password: string): Promise<AuthResult> => {
  // Use Firebase if configured
  if (isConfigured && auth && signInWithEmailAndPassword && getDoc && doc) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
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
  }
  
  // Fallback to mock authentication
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  if (mockPasswords[user.email] !== password) {
    return { success: false, error: 'Invalid password' };
  }
  
  return { success: true, user };
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  try {
    if (isConfigured && auth && signOut) {
      await signOut(auth);
    }
    clearUserSession();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// Get current user data
export const getCurrentUserData = async (): Promise<User | null> => {
  try {
    if (isConfigured && auth && getDoc && doc) {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) return null;
      
      return userDoc.data() as User;
    }
    
    // Fallback to session storage
    return getUserSession();
  } catch (error) {
    console.error('Error getting current user data:', error);
    return getUserSession();
  }
};

// Update user data
export const updateUserData = async (userData: Partial<User>): Promise<boolean> => {
  try {
    if (isConfigured && auth && setDoc && doc && serverTimestamp) {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return false;
      
      const updateData = {
        ...userData,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), updateData, { merge: true });
      
      const updatedUser = await getCurrentUserData();
      if (updatedUser) {
        setUserSession(updatedUser);
      }
      
      return true;
    }
    
    // Fallback: update session storage
    const currentUser = getUserSession();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData, updatedAt: new Date() };
      setUserSession(updatedUser);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};

// Client-side session management
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
  if (isConfigured && auth) {
    return auth.currentUser !== null || getUserSession() !== null;
  }
  return getUserSession() !== null;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (isConfigured && auth && onAuthStateChanged) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getCurrentUserData();
        if (userData) {
          setUserSession(userData);
          callback(userData);
        } else {
          callback(null);
        }
      } else {
        clearUserSession();
        callback(null);
      }
    });
  }
  
  // Fallback: return a no-op unsubscribe function
  return () => {};
};