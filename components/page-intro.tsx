import { type ReactNode } from 'react';

export function PageIntro({
  title,
  description,
  eyebrow,
  badge,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  eyebrow?: ReactNode;
  badge?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {badge && <div>{badge}</div>}
      {eyebrow && !badge && (
        <p className="text-xs font-semibold text-primary">
          {eyebrow}
        </p>
      )}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground [text-wrap:balance]">
          {title}
        </h1>
        {description && (
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed [text-wrap:pretty]">
            {description}
          </p>
        )}
      </div>
      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}
