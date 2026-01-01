"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  backHref?: string;
  actions?: ReactNode;
}

export function Header({
  title,
  subtitle,
  icon,
  backHref,
  actions,
}: HeaderProps) {
  return (
    <header className="navbar bg-base-100/80 backdrop-blur-xl sticky top-0 z-50 border-b border-base-200">
      <div className="navbar-start gap-2">
        {backHref && (
          <Link href={backHref}>
            <Button variant="ghost" circle>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        )}
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-content">
            {icon}
          </div>
        )}
        <div>
          <h1 className="font-bold text-sm sm:text-base">{title}</h1>
          {subtitle && (
            <p className="text-xs text-base-content/60">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="navbar-end gap-1">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}
