// Simple authentication system for demo purposes
// In production, use a proper authentication service like NextAuth.js or Supabase Auth

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

// Mock database - in production, this would be a real database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'alex.johnson@example.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    createdAt: '2024-01-01'
  }
];

// Mock passwords - in production, these would be hashed
const mockPasswords: Record<string, string> = {
  'alex.johnson@example.com': 'password123',
  'demo@example.com': 'demo123'
};

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const authenticateUser = async (email: string, password: string): Promise<AuthResult> => {
  // Simulate API delay
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

export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existingUser) {
    return { success: false, error: 'User already exists' };
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    createdAt: new Date().toISOString().split('T')[0]
  };

  // Add to mock database
  mockUsers.push(newUser);
  mockPasswords[newUser.email] = userData.password;

  return { success: true, user: newUser };
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

export const isAuthenticated = (): boolean => {
  return getUserSession() !== null;
};