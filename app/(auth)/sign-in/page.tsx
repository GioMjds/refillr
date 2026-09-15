import { SignInForm } from '@/features/auth/components/sign-in-form';
import { isSafeReturnPath } from '@/lib/auth/routes';

export default async function SignInPage({
  searchParams,
}: PageProps<'/sign-in'>) {
  const { next } = await searchParams;
  const safeNext =
    typeof next === 'string' && isSafeReturnPath(next) ? next : null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Refillr
        </h1>
        <p className="text-sm text-muted-foreground">
          Water Refilling Operations
        </p>
      </div>
      <SignInForm nextPath={safeNext} />
    </main>
  );
}
