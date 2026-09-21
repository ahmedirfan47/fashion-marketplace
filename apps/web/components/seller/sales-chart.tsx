type DayPoint = { label: string; value: number };

export function SalesChart({ data }: { data: DayPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="border border-border bg-surface p-6">
      <p className="text-xs uppercase tracking-wide text-muted">Sales, last 14 days</p>
      <div className="mt-6 flex h-40 items-end gap-1.5">
        {data.map((d) => (
          <div key={d.label} className="group relative flex-1">
            <div
              className="w-full bg-accent transition-opacity group-hover:opacity-80"
              style={{ height: `${Math.max(4, (d.value / max) * 100)}%` }}
            />
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap bg-surface-strong px-2 py-1 text-[10px] text-accent-ink opacity-0 transition-opacity group-hover:opacity-100">
              {d.label}: {d.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}