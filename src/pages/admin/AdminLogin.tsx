import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { authSchema } from '@/lib/validations';
import { z } from 'zod';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn, signUp, user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupFullName, setSignupFullName] = useState('');

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/dashboard');
    } else if (user && !isAdmin) {
      // User is authenticated but not admin, redirect to home after a delay
      const timer = setTimeout(() => {
        toast.info('Vous devez être administrateur pour accéder à cette section.');
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      const validatedData = authSchema.pick({ email: true, password: true }).parse({
        email: loginEmail,
        password: loginPassword,
      });

      const { error } = await signIn(validatedData.email, validatedData.password);

      if (error) {
        toast.error(error.message || 'Erreur lors de la connexion');
        return;
      }

      toast.success('Connexion réussie!');
      navigate('/admin/dashboard');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error('Erreur lors de la connexion');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      const validatedData = authSchema.parse({
        email: signupEmail,
        password: signupPassword,
        fullName: signupFullName,
      });

      const { error } = await signUp(
        validatedData.email,
        validatedData.password,
        validatedData.fullName
      );

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Cet email est déjà utilisé');
        } else {
          toast.error(error.message || 'Erreur lors de l\'inscription');
        }
        return;
      }

      // Wait a bit for the auth state to update
      setTimeout(() => {
        // The useEffect will handle redirection based on isAdmin status
        // If not admin, redirect to home with message
        if (!isAdmin) {
          toast.info('Votre compte a été créé. Un administrateur doit vous attribuer les droits d\'accès.');
          navigate('/');
        }
      }, 1500);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error('Erreur lors de l\'inscription');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Administration Sana</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder au panneau d'administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nom complet</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground">
                    Min. 8 caractères avec majuscule, minuscule et chiffre
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Inscription...' : 'S\'inscrire'}
                </Button>
                <div className="space-y-2 mt-4">
                  <p className="text-xs text-muted-foreground text-center">
                    ⚠️ Note importante: Après l'inscription, un administrateur doit vous attribuer le rôle admin.
                  </p>
                  <p className="text-xs text-accent text-center font-medium">
                    Pour le premier admin: Suivez les instructions dans SETUP_PRODUCTION.md
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
