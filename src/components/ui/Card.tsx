import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  compact?: boolean;
  bordered?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  compact = false,
  bordered = false,
  glass = false,
  onClick,
}: CardProps) {
  const classes = [
    "card bg-base-100 shadow-lg",
    compact && "card-compact",
    bordered && "card-bordered",
    glass && "glass",
    onClick && "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = "" }: CardBodyProps) {
  return <div className={`card-body ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return <h2 className={`card-title ${className}`}>{children}</h2>;
}

interface CardActionsProps {
  children: ReactNode;
  className?: string;
  justify?: "start" | "end" | "center";
}

export function CardActions({
  children,
  className = "",
  justify = "end",
}: CardActionsProps) {
  return (
    <div className={`card-actions justify-${justify} ${className}`}>
      {children}
    </div>
  );
}
