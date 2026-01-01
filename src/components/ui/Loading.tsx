type LoadingVariant =
  | "spinner"
  | "dots"
  | "ring"
  | "ball"
  | "bars"
  | "infinity";
type LoadingSize = "xs" | "sm" | "md" | "lg";

interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  className?: string;
}

export function Loading({
  variant = "spinner",
  size = "md",
  className = "",
}: LoadingProps) {
  return (
    <span
      className={`loading loading-${variant} loading-${size} ${className}`}
    ></span>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Memuat..." }: LoadingOverlayProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="flex flex-col items-center gap-4">
        <Loading variant="spinner" size="lg" className="text-primary" />
        <p className="text-base-content/60 font-medium">{message}</p>
      </div>
    </div>
  );
}
