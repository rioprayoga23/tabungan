"use client";

import { cn } from "@/lib/utils";

type LoadingSize = "sm" | "md" | "lg";

interface LoadingProps {
  size?: LoadingSize;
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
};

export function Loading({ size = "md", className = "" }: LoadingProps) {
  return (
    <div
      className={cn(
        sizeClasses[size],
        "border-primary border-t-transparent rounded-full animate-spin",
        className
      )}
    />
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Memuat..." }: LoadingOverlayProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 p-8 border-2 border-border shadow-lg bg-card">
        <Loading size="lg" />
        <p className="font-medium text-foreground">{message}</p>
      </div>
    </div>
  );
}
