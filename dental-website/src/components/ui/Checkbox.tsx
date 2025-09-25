import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <div className="flex items-start">
          <input
            type="checkbox"
            id={id}
            className={cn(
              'mt-1 h-4 w-4 rounded border-gray-300 text-primary-600',
              'focus:ring-2 focus:ring-primary-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {label && (
            <label
              htmlFor={id}
              className="ml-2 block text-sm text-gray-700"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500 ml-6">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';