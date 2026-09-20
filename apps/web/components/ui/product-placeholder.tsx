export function ProductPlaceholder({
  className = "",
  iconClassName = "h-10 w-10",
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-surface ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface to-border/40" />
      <svg
        viewBox="0 0 48 48"
        className={`relative text-border-strong ${iconClassName}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M24 4v6" strokeLinecap="round" />
        <path
          d="M24 10c-3 0-5 2-5 5l-13 7 4 6 9-4v16h20V24l9 4 4-6-13-7c0-3-2-5-5-5z"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}