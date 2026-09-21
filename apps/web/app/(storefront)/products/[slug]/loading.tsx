import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Skeleton className="mb-8 h-4 w-52" />
      <div className="grid gap-12 md:grid-cols-2">
        <Skeleton className="aspect-[3/4]" />
        <div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-9 w-3/4" />
          <Skeleton className="mt-4 h-6 w-24" />
          <Skeleton className="mt-6 h-16 w-full" />
        </div>
      </div>
    </main>
  );
}