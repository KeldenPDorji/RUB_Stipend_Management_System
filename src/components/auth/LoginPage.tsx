import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, User, GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, requiresMFA } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={activeTab === 'student' ? '/student/dashboard' : '/admin/dashboard'} replace />;
  }

  // Redirect to MFA if required
  if (requiresMFA) {
    return <Navigate to="/auth/mfa-verify" replace />;
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password, activeTab, formData.rememberMe);
      
      if (result.success) {
        if (result.requiresMFA) {
          navigate('/auth/mfa-verify');
        } else {
          const redirectPath = activeTab === 'student' ? '/student/dashboard' : '/admin/dashboard';
          navigate(redirectPath);
          
          toast({
            title: "Login Successful",
            description: `Welcome back! Redirecting to your ${activeTab} dashboard.`,
          });
        }
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholders = () => {
    return activeTab === 'student' 
      ? { username: 'Student ID or Username', example: 'e.g., ST2024001 or student123' }
      : { username: 'Admin Username', example: 'e.g., admin' };
  };

  const placeholders = getPlaceholders();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center shadow-institutional">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">RUB Student Stipend</h1>
          <p className="text-muted-foreground">Management System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-card-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Access your account to manage stipend applications
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'student' | 'admin')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  SSO Staff
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4 m-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-username">Username or Student ID</Label>
                    <Input
                      id="student-username"
                      type="text"
                      placeholder={placeholders.username}
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="h-11"
                      required
                      autoComplete="username"
                      aria-describedby="student-username-hint"
                    />
                    <p id="student-username-hint" className="text-sm text-muted-foreground">
                      {placeholders.example}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="h-11 pr-10"
                        required
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                    />
                    <Label htmlFor="remember-me" className="text-sm text-muted-foreground">
                      Remember me on this device
                    </Label>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-11" 
                    disabled={isLoading}
                    aria-describedby={error ? 'error-message' : undefined}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In as Student'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 m-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">Admin Username</Label>
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder={placeholders.username}
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="h-11"
                      required
                      autoComplete="username"
                      aria-describedby="admin-username-hint"
                    />
                    <p id="admin-username-hint" className="text-sm text-muted-foreground">
                      {placeholders.example}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your admin password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="h-11 pr-10"
                        required
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="admin-remember-me"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                    />
                    <Label htmlFor="admin-remember-me" className="text-sm text-muted-foreground">
                      Remember me on this device
                    </Label>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-11" 
                    disabled={isLoading}
                    aria-describedby={error ? 'error-message' : undefined}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In as Admin'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Having trouble signing in?{' '}
                <a href="/auth/forgot-password" className="text-primary hover:underline">
                  Reset your password
                </a>
              </p>
            </div>
            
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>Demo Credentials:</p>
              <p><strong>Student:</strong> student123 / password123</p>
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>MFA Code:</strong> 123456</p>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 Royal University of Bhutan</p>
          <p>Student Support Office - Stipend Management System</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;