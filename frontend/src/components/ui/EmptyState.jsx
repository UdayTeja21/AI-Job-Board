import React from 'react';
import { cn } from '../../lib/utils';
import Button from './Button';

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className 
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 py-16 animate-fade-in", className)}>
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-[hsl(var(--surface-hover))] flex items-center justify-center mb-4 text-text-muted border border-border shadow-sm">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-heading font-semibold text-text mb-2">{title}</h3>
      <p className="text-text-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
