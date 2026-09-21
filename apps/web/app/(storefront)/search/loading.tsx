import { ProductGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Skeleton className="h-7 w-52" />
      <div className="mt-8">
        <ProductGridSkeleton />
      </div>
    </main>
  );
}