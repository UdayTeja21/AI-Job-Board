import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: 'bg-primary/10 text-primary hover:bg-primary/20',
    secondary: 'bg-[hsl(var(--surface-hover))] text-text hover:bg-border/50',
    success: 'bg-success/10 text-success hover:bg-success/20',
    warning: 'bg-warning/10 text-warning-foreground hover:bg-warning/20',
    danger: 'bg-danger/10 text-danger hover:bg-danger/20',
    outline: 'border border-border text-text-muted hover:bg-surface-hover',
    custom: '',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
