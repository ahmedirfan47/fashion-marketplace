const items = [
  { title: "Direct from brands", detail: "No resellers, no markups" },
  { title: "Verified sellers", detail: "Every brand reviewed before listing" },
  { title: "Nationwide delivery", detail: "Shipped from Pakistan" },
];

export function TrustBar() {
  return (
    <div className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-8 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.title}>
            <p className="text-sm font-medium text-ink">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}