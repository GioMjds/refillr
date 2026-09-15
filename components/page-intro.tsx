import { type ReactNode } from 'react';

export function PageIntro({
  title,
  description,
  eyebrow,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
      )}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}
