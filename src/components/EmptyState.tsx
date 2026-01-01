"use client";

import { ReactNode } from "react";
import { IconBox, Button } from "@/components/ui";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <IconBox variant="neutral" size="lg" className="mb-4 opacity-50">
        {icon}
      </IconBox>
      <h3 className="font-semibold text-base-content mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-base-content/60 mb-4 max-w-xs">
          {description}
        </p>
      )}
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
