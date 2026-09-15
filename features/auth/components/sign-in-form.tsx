'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInAction, type SignInState } from '@/features/auth/actions';
import { signInSchema, type SignInInput } from '@/features/auth/schemas';

const initialState: SignInState = {
  status: 'idle',
  message: '',
};

export function SignInForm({ nextPath }: { nextPath: string | null }) {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: SignInInput) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (nextPath) formData.append('next', nextPath);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Card className="w-full max-w-md shadow-sm border-border bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
          Staff & Operations Sign In
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your station credentials to access management tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {state.status === 'error' && state.message && (
            <div
              role="alert"
              className="rounded-md bg-destructive/15 p-3 text-sm text-destructive"
            >
              {state.message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full h-11">
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
