import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, hoverEffect = false, ...props }) {
  return (
    <div 
      className={cn(
        "bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 shadow-sm", 
        hoverEffect && "hover:shadow-premium hover:border-border/80 hover:-translate-y-1",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-5 border-b border-border/50", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-xl font-heading font-semibold leading-tight tracking-tight text-text", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-4 border-t border-border/50 bg-[hsl(var(--surface-hover)/0.5)] flex items-center", className)} {...props}>
      {children}
    </div>
  );
}
