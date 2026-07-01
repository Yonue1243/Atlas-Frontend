import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/** Placeholder animado para estados de carga. */
export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-muted", className)}
      {...props}
    />
  );
}
