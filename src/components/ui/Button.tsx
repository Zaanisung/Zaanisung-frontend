import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 tracking-wide select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A59] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 h-8 gap-1.5 rounded-sm',
    md: 'text-sm px-5 py-2.5 h-10 gap-2 rounded-sm',
    lg: 'text-base px-7 py-3.5 h-12 gap-2.5 rounded-sm',
  };

  const variantStyles = {
    primary: 'bg-[#171512] text-[#F8F5EF] hover:bg-[#2A241F] active:bg-[#000000] border border-[#171512]',
    gold: 'bg-[#B69A59] text-[#171512] hover:bg-[#A38747] active:bg-[#92733C] font-semibold border border-[#B69A59]',
    secondary: 'bg-[#F0ECE5] text-[#171512] hover:bg-[#E4DED3] border border-transparent',
    outline: 'bg-transparent text-[#171512] border border-[#E4DED3] hover:border-[#171512] hover:bg-[#F0ECE5]/50',
    ghost: 'bg-transparent text-[#171512] hover:bg-[#F0ECE5] border border-transparent',
    danger: 'bg-red-800 text-white hover:bg-red-900 border border-red-900',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
