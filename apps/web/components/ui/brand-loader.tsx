export function BrandLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5">
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" style={{ animationDuration: "1.6s" }} />
        <span
          className="absolute inset-0 rounded-full border-2 border-accent/25 border-t-accent"
          style={{ animation: "brandspin 0.9s linear infinite" }}
        />
        <span className="absolute inset-[30%] rounded-full bg-accent" style={{ animation: "brandpulse 1.6s ease-in-out infinite" }} />
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
    </div>
  );
}