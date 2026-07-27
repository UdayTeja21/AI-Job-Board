import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading = false, children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-button border border-transparent',
    secondary: 'bg-[hsl(var(--surface-hover))] text-text border border-border hover:bg-[hsl(var(--surface-hover)/0.8)] shadow-sm',
    ghost: 'bg-transparent text-text hover:bg-[hsl(var(--surface-hover))]',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-sm border border-transparent',
    outline: 'bg-transparent text-text border border-border hover:border-text/20 hover:bg-[hsl(var(--surface-hover))] shadow-sm',
    link: 'bg-transparent text-primary underline-offset-4 hover:underline'
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
