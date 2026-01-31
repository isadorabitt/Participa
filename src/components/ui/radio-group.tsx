import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RadioGroupOption {
  value: string;
  label: string;
  'aria-label'?: string;
}

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  options: readonly RadioGroupOption[] | RadioGroupOption[];
  name: string;
  onChange: (value: string) => void;
  'aria-label'?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      value,
      options,
      name,
      onChange,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('flex flex-col gap-3', className)}
      {...props}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex cursor-pointer items-center gap-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={opt['aria-label'] ?? opt.label}
            className="h-4 w-4 border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  )
);
RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
