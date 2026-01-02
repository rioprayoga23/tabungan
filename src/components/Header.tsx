"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

interface HeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

export function Header({
  title,
  subtitle,
  backHref,
  actions,
  maxWidth = "5xl",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background border-b-2 border-border">
      <div className={`${maxWidthClasses[maxWidth]} mx-auto px-3 sm:px-4`}>
        <div className="flex items-center justify-between py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {backHref && (
              <Link href={backHref}>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
            )}
            <div className="min-w-0">
              <h1 className="font-head font-bold text-sm sm:text-base truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-1 sm:gap-2">{actions}</div>
          )}
        </div>
      </div>
    </header>
  );
}
