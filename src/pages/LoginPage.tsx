import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ArrowUpRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { APP_CONFIG } from '@/config/navigation';
import { useAuth } from '@/contexts/auth.context';
import type { ApiError } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const demoAccounts = [
  { role: 'Client', email: 'client@digiayudh.com', password: 'Client@123' },
  { role: 'Employee', email: 'employee@digiayudh.com', password: 'Employee@123' },
  { role: 'Admin', email: 'admin@digiayudh.com', password: 'Admin@123' },
  { role: 'Super Admin', email: 'superadmin@digiayudh.com', password: 'Super@123' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: true },
  });

  const remember = watch('remember');

  const onSubmit = async (data: LoginFormData) => {
    try {
      const redirectTo = await login(data);
      toast.success('Welcome back!');
      navigate(redirectTo);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message ?? 'Login failed');
    }
  };

  const fillDemo = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute left-1/2 top-0 size-[500px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-3xl" />

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg">
            <img
              src="/DigiAyudhlogo.jpeg"
              alt="DigiAyudh Logo"
              className="h-8 w-8 rounded-lg object-cover"
            />
          </div>
            <span className="text-xl font-bold">{APP_CONFIG.name}</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">{APP_CONFIG.tagline}</p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to access your portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="pl-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id="remember"
                    checked={remember}
                    onCheckedChange={(v) => setValue('remember', v)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
                <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
                  Forgot password?
                </a>
              </div>

              <Button variant="brand" className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Login'}
              </Button>
              <a href="/signup" className="text-sm text-purple-400 hover:text-purple-300">
                  Sign up for an account
                </a>
            </form>

            

            <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Demo accounts</p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => fillDemo(acc.email, acc.password)}
                    className="rounded-lg border border-border bg-background px-2 py-1.5 text-left text-xs transition-colors hover:border-purple-500/30 hover:bg-purple-500/5"
                  >
                    <span className="font-medium">{acc.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="text-purple-400 hover:text-purple-300">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
