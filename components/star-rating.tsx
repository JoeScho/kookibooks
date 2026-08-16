import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STAR_KEYS = ["star-1", "star-2", "star-3", "star-4", "star-5"];

export function StarRating({ className }: { className?: string }) {
  return (
    <div className={cn("flex text-sun", className)}>
      {STAR_KEYS.map((key) => (
        <Star key={key} className="size-4 fill-current" />
      ))}
    </div>
  );
}
