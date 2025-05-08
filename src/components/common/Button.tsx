import React, { ButtonHTMLAttributes } from 'react';
import { FaSpinner } from "react-icons/fa";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline';
  
  /**
   * Size of the button
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the button is in active state
   * @default false
   */
  active?: boolean;
  
  /**
   * Whether the button takes up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Icon to display before button text
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon to display after button text
   */
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  active = false,
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles
  const baseClasses = 'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors rounded-md';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  // Variant classes (including active state variations)
  const variantClasses = {
    primary: {
      default: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
      active: 'text-white bg-blue-800 hover:bg-blue-900 focus:ring-blue-700 disabled:bg-blue-300'
    },
    secondary: {
      default: 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400',
      active: 'text-gray-800 bg-gray-300 hover:bg-gray-400 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400'
    },
    outline: {
      default: 'text-blue-700 bg-transparent border border-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:text-blue-300 disabled:border-blue-300',
      active: 'text-blue-800 bg-blue-50 border border-blue-700 hover:bg-blue-100 focus:ring-blue-500 disabled:text-blue-300 disabled:border-blue-300'
    }
  };
  
  // Loading state classes
  const loadingClasses = isLoading 
    ? 'cursor-not-allowed opacity-80' 
    : '';
  
  // Full width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Combined classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${active ? variantClasses[variant].active : variantClasses[variant].default}
    ${loadingClasses}
    ${widthClass}
    ${className}
  `;
  
  return (
    <button 
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" />
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;