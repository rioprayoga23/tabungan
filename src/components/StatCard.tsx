"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardBody, IconBox } from "@/components/ui";

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
    <Card className={className}>
      <CardBody className="p-4">
        <div className="flex items-start justify-between mb-2">
          <IconBox variant="primary" size="md">
            {icon}
          </IconBox>
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold ${
                trend.positive ? "text-success" : "text-error"
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
        <p className="text-xs text-base-content/60 uppercase tracking-wide font-medium">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-primary">{value}</p>
      </CardBody>
    </Card>
  );
}
