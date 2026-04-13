import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'accent', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none',
        variant === 'accent' && 'bg-accent text-white hover:brightness-110',
        variant === 'primary' && 'bg-primary text-white hover:brightness-110',
        variant === 'outline' && 'border border-primary text-primary hover:bg-primary/5',
        variant === 'ghost' && 'text-primary hover:bg-primary/5',
        size === 'sm' && 'px-4 py-1.5 text-sm',
        size === 'md' && 'px-6 py-2.5 text-base',
        size === 'lg' && 'px-8 py-3 text-lg w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
