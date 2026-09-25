import { FullPageSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col justify-center">
      <FullPageSkeleton />
    </div>
  );
}
