import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading = false, children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:shadow-md active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-accent text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-transparent focus:ring-primary',
    secondary: 'bg-[hsl(var(--surface-hover))] text-text border border-border/50 hover:bg-[hsl(var(--surface))] hover:border-border shadow-sm',
    ghost: 'bg-transparent text-text hover:bg-[hsl(var(--surface-hover))] shadow-none hover:shadow-none',
    danger: 'bg-gradient-to-r from-danger to-red-500 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] focus:ring-danger',
    outline: 'bg-transparent text-text border border-border hover:border-primary/50 hover:bg-primary/5 shadow-none'
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6',
    lg: 'h-14 px-8 text-lg',
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
