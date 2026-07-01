import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/** Etiqueta compacta para metadatos (región, categoría, etc.). */
export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
