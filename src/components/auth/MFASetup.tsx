import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Mail, Smartphone, KeyRound, Loader2, QrCode, Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const MFASetup: React.FC = () => {
  const navigate = useNavigate();
  const { setupMFA } = useAuth();
  const { toast } = useToast();

  const [selectedMethod, setSelectedMethod] = useState<'email' | 'sms' | 'authenticator'>('authenticator');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [setupData, setSetupData] = useState<{
    secret?: string;
    qrCode?: string;
    isSetup: boolean;
  }>({ isSetup: false });
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);

  const handleSetupMFA = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await setupMFA(selectedMethod);
      
      if (result.success) {
        setSetupData({
          secret: result.secret,
          qrCode: result.qrCode,
          isSetup: true,
        });
        
        toast({
          title: "MFA Setup Initiated",
          description: `${selectedMethod === 'authenticator' ? 'Authenticator' : selectedMethod.toUpperCase()} setup is ready for verification.`,
        });
      } else {
        setError(result.error || 'MFA setup failed. Please try again.');
      }
    } catch (error) {
      console.error('MFA setup error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Mock verification for setup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationCode === '123456') {
        toast({
          title: "MFA Setup Complete",
          description: `${selectedMethod === 'authenticator' ? 'Authenticator' : selectedMethod.toUpperCase()} has been successfully configured.`,
        });
        
        navigate('/auth/login');
      } else {
        setError('Invalid verification code. Please try again.');
        setVerificationCode('');
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const copySecret = async () => {
    if (setupData.secret) {
      await navigator.clipboard.writeText(setupData.secret);
      setSecretCopied(true);
      setTimeout(() => setSecretCopied(false), 2000);
      
      toast({
        title: "Secret Copied",
        description: "The secret key has been copied to your clipboard.",
      });
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'authenticator': return <KeyRound className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-institutional">
            <Shield className="w-8 h-8 text-success-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Setup Multi-Factor Authentication</h1>
          <p className="text-muted-foreground">Secure your account with an additional verification method</p>
        </div>

        {/* MFA Setup Card */}
        <Card className="shadow-lg border-card-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Choose Your MFA Method</CardTitle>
            <CardDescription className="text-center">
              Select how you'd like to receive verification codes
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!setupData.isSetup ? (
              <>
                <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as typeof selectedMethod)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="authenticator" className="flex items-center gap-1 text-xs">
                      <KeyRound className="w-3 h-3" />
                      App
                    </TabsTrigger>
                    <TabsTrigger value="email" className="flex items-center gap-1 text-xs">
                      <Mail className="w-3 h-3" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="flex items-center gap-1 text-xs">
                      <Smartphone className="w-3 h-3" />
                      SMS
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-4">
                    <TabsContent value="authenticator" className="space-y-4 m-0">
                      <div className="flex items-start gap-3 p-4 bg-accent rounded-lg">
                        <KeyRound className="w-5 h-5 text-accent-foreground mt-0.5" />
                        <div className="text-sm text-accent-foreground">
                          <p className="font-medium mb-1">Authenticator App</p>
                          <p>Use Google Authenticator, Authy, or similar apps to generate verification codes. This is the most secure option.</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="email" className="space-y-4 m-0">
                      <div className="flex items-start gap-3 p-4 bg-accent rounded-lg">
                        <Mail className="w-5 h-5 text-accent-foreground mt-0.5" />
                        <div className="text-sm text-accent-foreground">
                          <p className="font-medium mb-1">Email Verification</p>
                          <p>Receive verification codes via email. Codes will be sent to your registered RUB email address.</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="sms" className="space-y-4 m-0">
                      <div className="flex items-start gap-3 p-4 bg-accent rounded-lg">
                        <Smartphone className="w-5 h-5 text-accent-foreground mt-0.5" />
                        <div className="text-sm text-accent-foreground">
                          <p className="font-medium mb-1">SMS Verification</p>
                          <p>Receive verification codes via SMS. Codes will be sent to your registered phone number.</p>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleSetupMFA}
                  className="w-full h-11" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting Up...
                    </>
                  ) : (
                    <>
                      {getMethodIcon(selectedMethod)}
                      <span className="ml-2">Setup {selectedMethod === 'authenticator' ? 'Authenticator' : selectedMethod.toUpperCase()}</span>
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="space-y-6">
                {selectedMethod === 'authenticator' && setupData.secret && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-medium mb-2">Scan QR Code</h3>
                      <div className="bg-white p-4 rounded-lg border inline-block">
                        <div className="w-32 h-32 bg-muted rounded flex items-center justify-center">
                          <QrCode className="w-16 h-16 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Scan this QR code with your authenticator app
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secret-key">Or enter this key manually:</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secret-key"
                          value={setupData.secret}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={copySecret}
                          className="px-3"
                        >
                          {secretCopied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod !== 'authenticator' && (
                  <div className="text-center p-4 bg-accent rounded-lg">
                    <p className="text-sm text-accent-foreground">
                      {selectedMethod === 'email' ? 
                        'A verification code has been sent to your email address.' :
                        'A verification code has been sent to your phone number.'
                      }
                    </p>
                  </div>
                )}

                <form onSubmit={handleVerifySetup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="setup-verification-code">Enter Verification Code</Label>
                    <Input
                      id="setup-verification-code"
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
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-11" 
                    disabled={isVerifying || verificationCode.length !== 6}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Complete Setup'
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setSetupData({ isSetup: false })}
                    className="text-sm"
                  >
                    Choose Different Method
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Need help? Contact IT Support at{' '}
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

export default MFASetup;