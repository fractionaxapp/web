import { Skeleton } from '@/components/ui/skeleton';

export default function DealDetailLoading() {
  return (
    <main id="main" className="px-safe mx-auto max-w-5xl py-12" aria-busy="true" aria-label="Loading deal">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="mt-4 h-8 w-2/3" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
      <Skeleton className="mt-8 h-10 w-40 rounded-md" />
    </main>
  );
}
