"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, IconBox } from "@/components/ui";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({
  icon,
  label,
  value,
  trend,
  className = "",
}: StatCardProps) {
  return (
    <Card className={`block w-full ${className}`}>
      <Card.Content className="p-4">
        <div className="flex items-start justify-between mb-3">
          <IconBox size="md">{icon}</IconBox>
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-bold px-2 py-1 border-2 border-border ${
                trend.positive
                  ? "bg-success/20 text-success"
                  : "bg-destructive/20 text-destructive"
              }`}
            >
              {trend.positive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
          {label}
        </p>
        <p className="text-2xl font-head font-bold text-primary">{value}</p>
      </Card.Content>
    </Card>
  );
}
