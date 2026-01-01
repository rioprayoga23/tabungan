import { ReactNode } from "react";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "neutral";
type BadgeSize = "xs" | "sm" | "md" | "lg";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  outline?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  size = "md",
  outline = false,
  className = "",
}: BadgeProps) {
  const classes = [
    "badge",
    `badge-${variant}`,
    `badge-${size}`,
    outline && "badge-outline",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}
