import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-14 pb-16 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-5 h-14 w-full" />
          <Skeleton className="mt-3 h-14 w-3/4" />
          <Skeleton className="mt-6 h-4 w-full" />
        </div>
        <Skeleton className="aspect-[4/5] w-full" />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Skeleton className="mb-7 h-7 w-40" />
        <ProductGridSkeleton />
      </section>
    </main>
  );
}