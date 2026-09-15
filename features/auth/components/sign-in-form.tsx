'use client';

import { startTransition, useActionState, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  signInAction,
  signUpAction,
  type AuthFormState,
} from '@/features/auth/actions';
import { GoogleSignInButton } from '@/features/auth/components/google-sign-in-button';
import {
  signInSchema,
  signUpSchema,
  type SignInInput,
  type SignUpInput,
} from '@/features/auth/schemas';

const initialState = {
  status: 'idle',
  message: '',
} as AuthFormState;

export function SignInForm({
  nextPath,
  initialError,
}: {
  nextPath: string | null;
  initialError?: string | null;
}) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  const [signInState, signInFormAction, isSignInPending] = useActionState(
    signInAction,
    initialState,
  );

  const [signUpState, signUpFormAction, isSignUpPending] = useActionState(
    signUpAction,
    initialState,
  );

  const signInForm = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { displayName: '', email: '', password: '' },
  });

  const onSignInSubmit = (data: SignInInput) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (nextPath) formData.append('next', nextPath);

    startTransition(() => {
      signInFormAction(formData);
    });
  };

  const onSignUpSubmit = (data: SignUpInput) => {
    const formData = new FormData();
    if (data.displayName) formData.append('displayName', data.displayName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (nextPath) formData.append('next', nextPath);

    startTransition(() => {
      signUpFormAction(formData);
    });
  };

  const currentState = activeTab === 'signin' ? signInState : signUpState;
  const isPending = activeTab === 'signin' ? isSignInPending : isSignUpPending;

  return (
    <Card className="w-full max-w-md shadow-sm border-border bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
          {activeTab === 'signin' ? 'Sign in to Refillr' : 'Create an account'}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {activeTab === 'signin'
            ? 'Access water refill orders and station operations'
            : 'Get started with fast water refills'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {initialError === 'oauth-failed' && (
          <div
            role="alert"
            className="rounded-md bg-destructive/15 p-3 text-sm text-destructive"
          >
            Google sign-in could not be completed. Please try again.
          </div>
        )}

        {currentState.status === 'error' && currentState.message && (
          <div
            role="alert"
            className="rounded-md bg-destructive/15 p-3 text-sm text-destructive"
          >
            {currentState.message}
          </div>
        )}

        <GoogleSignInButton nextPath={nextPath} />

        <div className="relative flex items-center justify-center text-xs uppercase text-muted-foreground my-2">
          <span className="w-full border-t border-border" />
          <span className="bg-card px-2 whitespace-nowrap">or with email</span>
          <span className="w-full border-t border-border" />
        </div>

        <div
          role="tablist"
          className="grid grid-cols-2 rounded-lg bg-muted p-1 text-sm font-medium"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'signin'}
            onClick={() => setActiveTab('signin')}
            className={`rounded-md py-1.5 transition-all text-center ${
              activeTab === 'signin'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'signup'}
            onClick={() => setActiveTab('signup')}
            className={`rounded-md py-1.5 transition-all text-center ${
              activeTab === 'signup'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Create Account
          </button>
        </div>

        {activeTab === 'signin' ? (
          <form
            onSubmit={signInForm.handleSubmit(onSignInSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(signInForm.formState.errors.email)}
                {...signInForm.register('email')}
              />
              {signInForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {signInForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(signInForm.formState.errors.password)}
                {...signInForm.register('password')}
              />
              {signInForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isPending} className="w-full h-11">
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name (optional)</Label>
              <Input
                id="signup-name"
                type="text"
                autoComplete="name"
                {...signUpForm.register('displayName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(signUpForm.formState.errors.email)}
                {...signUpForm.register('email')}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {signUpForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(signUpForm.formState.errors.password)}
                {...signUpForm.register('password')}
              />
              {signUpForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isPending} className="w-full h-11">
              {isPending ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
