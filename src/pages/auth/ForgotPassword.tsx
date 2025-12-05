// ============================================================================
// ENUX - Forgot Password Page
// ============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRequestPasswordReset } from '@/hooks/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GitBranch, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

// Form schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const requestResetMutation = useRequestPasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await requestResetMutation.mutateAsync(data.email);
      setIsSuccess(true);
    } catch {
      // Error handled by mutation
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-success" />
              </div>
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We've sent a password reset link to your email address.
              Please check your inbox and follow the instructions.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col space-y-4">
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GitBranch className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {requestResetMutation.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {requestResetMutation.error instanceof Error
                    ? requestResetMutation.error.message
                    : 'Failed to send reset email'}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                disabled={requestResetMutation.isPending}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={requestResetMutation.isPending}
            >
              {requestResetMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send reset link'
              )}
            </Button>

            <Link to="/login" className="text-sm text-primary hover:underline">
              <ArrowLeft className="inline-block mr-1 h-3 w-3" />
              Back to login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
