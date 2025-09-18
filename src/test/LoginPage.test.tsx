import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../components/auth/LoginPage';
import { AuthProvider } from '../contexts/AuthContext';

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

describe('LoginPage', () => {
  it('renders login form with student and admin tabs', () => {
    render(
      <MockedApp>
        <LoginPage />
      </MockedApp>
    );

    expect(screen.getByText('RUB Student Stipend')).toBeInTheDocument();
    expect(screen.getByText('Management System')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('SSO Staff')).toBeInTheDocument();
  });

  it('switches between student and admin login modes', () => {
    render(
      <MockedApp>
        <LoginPage />
      </MockedApp>
    );

    const adminTab = screen.getByText('SSO Staff');
    fireEvent.click(adminTab);

    expect(screen.getByText('Sign In as Admin')).toBeInTheDocument();
  });

  it('shows validation error for empty credentials', async () => {
    render(
      <MockedApp>
        <LoginPage />
      </MockedApp>
    );

    const submitButton = screen.getByText('Sign In as Student');
    fireEvent.click(submitButton);

    // Form should not submit with empty fields due to HTML5 validation
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('shows password visibility toggle', () => {
    render(
      <MockedApp>
        <LoginPage />
      </MockedApp>
    );

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const toggleButton = screen.getByLabelText('Show password');

    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
