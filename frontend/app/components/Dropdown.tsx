'use client';

import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  title: string;
  options: string[];
  onChange?: (value: string) => void;
  className?: string;
  showSelectedBelow?: boolean;
}

export default function Dropdown({
  title,
  options,
  onChange,
  className = '',
  showSelectedBelow = true,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((s) => !s)}
        className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 cursor-pointer flex items-center gap-3"
      >
        <span className="font-medium">{title}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showSelectedBelow && selected && (
        <div className="mt-2 text-sm text-white/80 px-3">
          {selected}
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white/8 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg z-20 w-[220px]">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="w-full text-left px-4 py-2 text-white hover:bg-white/20 first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}