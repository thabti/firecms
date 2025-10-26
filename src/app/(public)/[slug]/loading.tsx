import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-12">
          <Skeleton className="h-14 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full" />
        </header>

        <div className="space-y-16">
          {[1, 2, 3].map((i) => (
            <section key={i}>
              <Skeleton className="h-10 w-1/2 mb-6" />
              <div className="space-y-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-64 w-full mt-8" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
