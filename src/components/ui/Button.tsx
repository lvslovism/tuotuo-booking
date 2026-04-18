import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'accent', size = 'md', className, children, ...props }: ButtonProps) {
  // "accent" and "primary" both map to the theme CTA — theme tokens decide color/shape.
  const useCta = variant === 'accent' || variant === 'primary';

  return (
    <button
      className={cn(
        'font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center gap-2',
        useCta && 'theme-cta',
        variant === 'outline' && 'theme-btn-outline',
        variant === 'ghost' && 'bg-transparent',
        size === 'sm' && 'text-sm px-4 py-1.5',
        size === 'md' && 'text-base px-5 py-2.5',
        size === 'lg' && 'text-base px-6 py-3.5 w-full',
        className,
      )}
      style={variant === 'ghost' ? { color: 'var(--t-primary)' } : undefined}
      {...props}
    >
      {children}
    </button>
  );
}
