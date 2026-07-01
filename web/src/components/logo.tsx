import { cn } from "@/lib/utils";

/** Marca de Atlas: isotipo geométrico + wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-primary/15 ring-1 ring-inset ring-primary/30">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3.5 12h17" />
          <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" />
        </svg>
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Atlas
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Recursos naturales
        </span>
      </div>
    </div>
  );
}
