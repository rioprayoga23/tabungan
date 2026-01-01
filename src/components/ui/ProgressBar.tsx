type ProgressVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={className}>
      <progress
        className={`progress progress-${variant} w-full`}
        value={percentage}
        max="100"
      ></progress>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-base-content/60">
          <span>{percentage}%</span>
          <span>{max.toLocaleString("id-ID")}</span>
        </div>
      )}
    </div>
  );
}
