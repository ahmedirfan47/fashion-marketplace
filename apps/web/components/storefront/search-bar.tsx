export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" method="GET" className="hidden sm:block">
      <input
        type="text"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search products"
        className="w-40 border-b border-border bg-transparent px-1 py-1 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
    </form>
  );
}