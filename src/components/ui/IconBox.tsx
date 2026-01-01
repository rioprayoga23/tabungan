import { ReactNode } from "react";

type IconBoxVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "neutral";
type IconBoxSize = "sm" | "md" | "lg";

interface IconBoxProps {
  children: ReactNode;
  variant?: IconBoxVariant;
  size?: IconBoxSize;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function IconBox({
  children,
  variant = "primary",
  size = "md",
  className = "",
}: IconBoxProps) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-${variant}/10 flex items-center justify-center text-${variant} ${className}`}
    >
      {children}
    </div>
  );
}
