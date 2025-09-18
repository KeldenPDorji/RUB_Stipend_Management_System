import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'admin';
  firstName?: string;
  lastName?: string;
  studentId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  requiresMFA: boolean;
  sessionExpiry: Date | null;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string, role: 'student' | 'admin', rememberMe?: boolean) => Promise<{ success: boolean; requiresMFA?: boolean; error?: string }>;
  logout: () => void;
  verifyMFA: (code: string, method: 'email' | 'sms' | 'authenticator') => Promise<{ success: boolean; error?: string }>;
  setupMFA: (method: 'email' | 'sms' | 'authenticator') => Promise<{ success: boolean; secret?: string; qrCode?: string; error?: string }>;
  refreshToken: () => Promise<boolean>;
  extendSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    requiresMFA: false,
    sessionExpiry: null,
  });

  const { toast } = useToast();

  // Session timeout management
  useEffect(() => {
    let sessionTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;

    if (authState.isAuthenticated && authState.sessionExpiry) {
      const timeUntilExpiry = authState.sessionExpiry.getTime() - Date.now();
      const timeUntilWarning = timeUntilExpiry - WARNING_TIME;

      if (timeUntilWarning > 0) {
        warningTimer = setTimeout(() => {
          toast({
            title: "Session Expiring Soon",
            description: "Your session will expire in 5 minutes. Click to extend.",
            action: (
              <button
                onClick={extendSession}
                className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary-hover"
              >
                Extend Session
              </button>
            ),
          });
        }, timeUntilWarning);
      }

      sessionTimer = setTimeout(() => {
        logout();
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity.",
          variant: "destructive",
        });
      }, timeUntilExpiry);
    }

    return () => {
      if (sessionTimer) clearTimeout(sessionTimer);
      if (warningTimer) clearTimeout(warningTimer);
    };
  }, [authState.sessionExpiry, authState.isAuthenticated]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('rub_auth_token');
        const storedUser = localStorage.getItem('rub_auth_user');
        const storedExpiry = localStorage.getItem('rub_session_expiry');
        const rememberMe = localStorage.getItem('rub_remember_me') === 'true';

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser);
          const expiry = storedExpiry ? new Date(storedExpiry) : null;

          if (expiry && expiry.getTime() > Date.now()) {
            setAuthState(prev => ({
              ...prev,
              user,
              token: storedToken,
              isAuthenticated: true,
              sessionExpiry: expiry,
              isLoading: false,
            }));
          } else if (rememberMe) {
            // Attempt to refresh token
            refreshToken();
          } else {
            // Clear expired session
            clearAuthData();
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('rub_auth_token');
    localStorage.removeItem('rub_auth_user');
    localStorage.removeItem('rub_session_expiry');
    localStorage.removeItem('rub_remember_me');
  };

  const login = async (username: string, password: string, role: 'student' | 'admin', rememberMe: boolean = false) => {
    try {
      // This would be replaced with actual API call
      // For now, using mock authentication
      const mockResponse = await mockLogin(username, password, role);
      
      if (mockResponse.success) {
        if (mockResponse.requiresMFA) {
          setAuthState(prev => ({
            ...prev,
            requiresMFA: true,
            isLoading: false,
          }));
          return { success: true, requiresMFA: true };
        }

        const expiry = new Date(Date.now() + SESSION_TIMEOUT);
        
        // Store auth data
        localStorage.setItem('rub_auth_token', mockResponse.token!);
        localStorage.setItem('rub_auth_user', JSON.stringify(mockResponse.user!));
        localStorage.setItem('rub_session_expiry', expiry.toISOString());
        
        if (rememberMe) {
          localStorage.setItem('rub_remember_me', 'true');
        }

        setAuthState({
          user: mockResponse.user!,
          token: mockResponse.token!,
          isAuthenticated: true,
          isLoading: false,
          requiresMFA: false,
          sessionExpiry: expiry,
        });

        return { success: true };
      } else {
        return { success: false, error: mockResponse.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    clearAuthData();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      requiresMFA: false,
      sessionExpiry: null,
    });
  };

  const verifyMFA = async (code: string, method: 'email' | 'sms' | 'authenticator') => {
    try {
      // Mock MFA verification
      const mockResponse = await mockMFAVerification(code, method);
      
      if (mockResponse.success) {
        const expiry = new Date(Date.now() + SESSION_TIMEOUT);
        
        localStorage.setItem('rub_auth_token', mockResponse.token!);
        localStorage.setItem('rub_auth_user', JSON.stringify(mockResponse.user!));
        localStorage.setItem('rub_session_expiry', expiry.toISOString());

        setAuthState(prev => ({
          ...prev,
          user: mockResponse.user!,
          token: mockResponse.token!,
          isAuthenticated: true,
          requiresMFA: false,
          sessionExpiry: expiry,
        }));

        return { success: true };
      } else {
        return { success: false, error: mockResponse.error };
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      return { success: false, error: 'MFA verification failed. Please try again.' };
    }
  };

  const setupMFA = async (method: 'email' | 'sms' | 'authenticator') => {
    try {
      // Mock MFA setup
      const mockResponse = await mockMFASetup(method);
      return mockResponse;
    } catch (error) {
      console.error('MFA setup error:', error);
      return { success: false, error: 'MFA setup failed. Please try again.' };
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      // Mock token refresh
      const token = localStorage.getItem('rub_auth_token');
      if (!token) return false;

      // In real implementation, this would call the refresh endpoint
      const mockResponse = await mockTokenRefresh(token);
      
      if (mockResponse.success) {
        const expiry = new Date(Date.now() + SESSION_TIMEOUT);
        
        localStorage.setItem('rub_auth_token', mockResponse.token!);
        localStorage.setItem('rub_session_expiry', expiry.toISOString());

        setAuthState(prev => ({
          ...prev,
          token: mockResponse.token!,
          sessionExpiry: expiry,
          isLoading: false,
        }));

        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  };

  const extendSession = () => {
    if (authState.isAuthenticated) {
      const newExpiry = new Date(Date.now() + SESSION_TIMEOUT);
      localStorage.setItem('rub_session_expiry', newExpiry.toISOString());
      
      setAuthState(prev => ({
        ...prev,
        sessionExpiry: newExpiry,
      }));

      toast({
        title: "Session Extended",
        description: "Your session has been extended for 30 minutes.",
      });
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    verifyMFA,
    setupMFA,
    refreshToken,
    extendSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock API functions (replace with actual API calls)
const mockLogin = async (username: string, password: string, role: 'student' | 'admin') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock credentials
  const validCredentials = {
    student: { username: 'student123', password: 'password123' },
    admin: { username: 'admin', password: 'admin123' }
  };

  if (
    username === validCredentials[role].username && 
    password === validCredentials[role].password
  ) {
    return {
      success: true,
      requiresMFA: true, // Simulate MFA requirement
      user: {
        id: '1',
        username,
        email: role === 'student' ? 'student@rub.edu.bt' : 'admin@rub.edu.bt',
        role,
        firstName: role === 'student' ? 'Student' : 'Admin',
        lastName: 'User',
        studentId: role === 'student' ? 'ST2024001' : undefined,
      },
      token: 'mock-jwt-token-' + Date.now(),
    };
  } else {
    return {
      success: false,
      error: 'Invalid credentials. Please check your username and password.',
    };
  }
};

const mockMFAVerification = async (code: string, method: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (code === '123456') {
    return {
      success: true,
      user: {
        id: '1',
        username: 'student123',
        email: 'student@rub.edu.bt',
        role: 'student' as const,
        firstName: 'Student',
        lastName: 'User',
        studentId: 'ST2024001',
      },
      token: 'mock-jwt-token-verified-' + Date.now(),
    };
  } else {
    return {
      success: false,
      error: 'Invalid verification code. Please try again.',
    };
  }
};

const mockMFASetup = async (method: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    secret: method === 'authenticator' ? 'JBSWY3DPEHPK3PXP' : undefined,
    qrCode: method === 'authenticator' ? 'data:image/png;base64,mock-qr-code' : undefined,
  };
};

const mockTokenRefresh = async (token: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    success: true,
    token: 'mock-refreshed-token-' + Date.now(),
  };
};