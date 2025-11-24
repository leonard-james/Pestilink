import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
}

export default function Input({ icon, label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          className={`w-full px-3 py-2 rounded-lg bg-white/20 border-none text-white 
          placeholder:text-white/60 text-sm focus:outline-none focus:ring-2 
          focus:ring-emerald-400 ${icon ? 'pr-10' : ''} ${className}`}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}