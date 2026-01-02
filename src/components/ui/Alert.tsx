import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const alertVariants = cva("p-4 border-2 flex items-start gap-3", {
  variants: {
    variant: {
      info: "bg-accent/20 border-border text-foreground",
      success: "bg-success/20 border-border text-foreground",
      warning: "bg-primary/20 border-border text-foreground",
      error: "bg-destructive/20 border-border text-foreground",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

interface AlertProps extends VariantProps<typeof alertVariants> {
  children: ReactNode;
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
    <div className={cn(alertVariants({ variant }), className)}>
      {icon}
      <span className="font-medium">{children}</span>
    </div>
  );
}
