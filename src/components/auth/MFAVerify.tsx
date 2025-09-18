import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Mail, Smartphone, KeyRound, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const MFAVerify: React.FC = () => {
  const navigate = useNavigate();
  const { verifyMFA, isAuthenticated, requiresMFA, user } = useAuth();
  const { toast } = useToast();

  const [selectedMethod, setSelectedMethod] = useState<'email' | 'sms' | 'authenticator'>('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if not requiring MFA
  if (!requiresMFA) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    const redirectPath = user?.role === 'student' ? '/student/dashboard' : '/admin/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyMFA(verificationCode, selectedMethod);
      
      if (result.success) {
        const redirectPath = user?.role === 'student' ? '/student/dashboard' : '/admin/dashboard';
        navigate(redirectPath);
        
        toast({
          title: "Verification Successful",
          description: "Multi-factor authentication completed successfully.",
        });
      } else {
        setError(result.error || 'Verification failed. Please try again.');
        setVerificationCode(''); // Clear the code on error
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setResendCooldown(60); // 60 second cooldown
    
    // Mock resend logic
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Code Sent",
      description: `A new verification code has been sent to your ${selectedMethod === 'email' ? 'email' : 'phone'}.`,
    });
  };

  const handleBackToLogin = () => {
    navigate('/auth/login');
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'authenticator': return <KeyRound className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getMethodDescription = (method: string) => {
    switch (method) {
      case 'email':
        return `We've sent a 6-digit code to your email address ending in ***@rub.edu.bt`;
      case 'sms':
        return `We've sent a 6-digit code to your registered phone number ending in ***-**-XX`;
      case 'authenticator':
        return 'Enter the 6-digit code from your authenticator app (Google Authenticator, Authy, etc.)';
      default:
        return 'Enter your verification code to continue';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center shadow-institutional">
            <Shield className="w-8 h-8 text-warning-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Multi-Factor Authentication</h1>
          <p className="text-muted-foreground">Secure your account with an additional verification step</p>
        </div>

        {/* MFA Card */}
        <Card className="shadow-lg border-card-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Verify Your Identity</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred verification method
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as typeof selectedMethod)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email" className="flex items-center gap-1 text-xs">
                  <Mail className="w-3 h-3" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center gap-1 text-xs">
                  <Smartphone className="w-3 h-3" />
                  SMS
                </TabsTrigger>
                <TabsTrigger value="authenticator" className="flex items-center gap-1 text-xs">
                  <KeyRound className="w-3 h-3" />
                  App
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                  {getMethodIcon(selectedMethod)}
                  <div className="text-sm text-accent-foreground">
                    {getMethodDescription(selectedMethod)}
                  </div>
                </div>
              </div>
            </Tabs>

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationCode(value);
                    setError('');
                  }}
                  className="h-12 text-center text-lg tracking-widest"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  autoComplete="one-time-code"
                  aria-describedby="code-description"
                />
                <p id="code-description" className="text-xs text-muted-foreground text-center">
                  Enter the 6-digit code you received
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>
            </form>

            <div className="space-y-3">
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || selectedMethod === 'authenticator'}
                  className="text-sm"
                >
                  {resendCooldown > 0 ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend in {resendCooldown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Code
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleBackToLogin}
                  className="text-sm"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Having trouble? Contact IT Support at{' '}
            <a href="mailto:it-support@rub.edu.bt" className="text-primary hover:underline">
              it-support@rub.edu.bt
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Demo:</strong> Use code <code className="bg-muted px-1 rounded">123456</code> for testing
          </p>
        </div>
      </div>
    </div>
  );
};

export default MFAVerify;