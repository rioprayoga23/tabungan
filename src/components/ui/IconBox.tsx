import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type IconBoxSize = "sm" | "md" | "lg";

interface IconBoxProps {
  children: ReactNode;
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
  size = "md",
  className = "",
}: IconBoxProps) {
  return (
    <div
      className={cn(
        sizeClasses[size],
        "border-2 border-border flex items-center justify-center bg-primary text-primary-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}
