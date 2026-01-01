import { ReactNode } from "react";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  icon?: ReactNode;
  className?: string;
}

export function Alert({
  children,
  variant = "info",
  icon,
  className = "",
}: AlertProps) {
  return (
    <div className={`alert alert-${variant} ${className}`}>
      {icon}
      <span>{children}</span>
    </div>
  );
}
