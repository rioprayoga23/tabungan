import { InputHTMLAttributes, forwardRef } from "react";

type InputSize = "xs" | "sm" | "md" | "lg";
type InputVariant =
  | "bordered"
  | "ghost"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  inputSize?: InputSize;
  variant?: InputVariant;
  leftAddon?: string;
  rightAddon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      inputSize = "md",
      variant = "bordered",
      leftAddon,
      rightAddon,
      className = "",
      ...props
    },
    ref
  ) => {
    const inputClasses = [
      "input",
      `input-${variant}`,
      `input-${inputSize}`,
      error && "input-error",
      "w-full",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (leftAddon || rightAddon) {
      return (
        <div className="form-control w-full">
          {label && (
            <label className="label">
              <span className="label-text font-medium">{label}</span>
            </label>
          )}
          <label
            className={`input ${
              variant === "bordered" ? "input-bordered" : `input-${variant}`
            } w-full flex items-center gap-2`}
          >
            {leftAddon && (
              <span className="font-semibold text-base-content/60">
                {leftAddon}
              </span>
            )}
            <input ref={ref} className="grow" {...props} />
            {rightAddon && (
              <span className="font-semibold text-base-content/60">
                {rightAddon}
              </span>
            )}
          </label>
          {error && (
            <label className="label">
              <span className="label-text-alt text-error">{error}</span>
            </label>
          )}
          {hint && !error && (
            <label className="label">
              <span className="label-text-alt">{hint}</span>
            </label>
          )}
        </div>
      );
    }

    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-medium">{label}</span>
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
        {hint && !error && (
          <label className="label">
            <span className="label-text-alt">{hint}</span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
