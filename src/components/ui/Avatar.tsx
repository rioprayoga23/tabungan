type AvatarSize = "xs" | "sm" | "md" | "lg";

interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  online?: boolean;
  offline?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: "w-6",
  sm: "w-8",
  md: "w-10",
  lg: "w-14",
};

export function Avatar({
  name,
  src,
  size = "md",
  online,
  offline,
  className = "",
}: AvatarProps) {
  const isRio = name.toLowerCase().includes("rio");
  const bgColor = isRio
    ? "bg-primary text-primary-content"
    : "bg-secondary text-secondary-content";

  if (src) {
    return (
      <div
        className={`avatar ${online ? "online" : ""} ${
          offline ? "offline" : ""
        } ${className}`}
      >
        <div className={`${sizeClasses[size]} rounded-full`}>
          <img src={src} alt={name} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`avatar placeholder ${online ? "online" : ""} ${
        offline ? "offline" : ""
      } ${className}`}
    >
      <div className={`${bgColor} ${sizeClasses[size]} rounded-full`}>
        <span className="font-bold">{name.charAt(0).toUpperCase()}</span>
      </div>
    </div>
  );
}
