import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Mock the toast hook
vi.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const MockedApp = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  it('renders loading state initially', () => {
    render(
      <MockedApp>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MockedApp>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('allows access when user has correct role', async () => {
    const ProtectedContent = () => {
      const auth = useAuth();
      
      // Mock authenticated state
      Object.assign(auth, {
        isAuthenticated: true,
        isLoading: false,
        user: { id: '1', username: 'student', role: 'student', email: 'test@test.com' },
        requiresMFA: false,
      });

      return (
        <ProtectedRoute allowedRoles={['student']}>
          <TestComponent />
        </ProtectedRoute>
      );
    };

    render(
      <MockedApp>
        <ProtectedContent />
      </MockedApp>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});
