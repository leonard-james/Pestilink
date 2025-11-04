"use client";
import React from "react";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "primary" | "ghost";
  ariaLabel?: string;
};

export default function Button({
  children,
  href,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
  ariaLabel,
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold transition-colors";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:opacity-90"
      : "bg-transparent text-green-300 hover:text-green-400";

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel}>
        <a className={`${base} ${styles} ${className}`.trim()}>{children}</a>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${base} ${styles} ${className}`.trim()}
    >
      {children}
    </button>
  );
}