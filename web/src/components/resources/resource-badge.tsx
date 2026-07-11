"use client";

import { Check } from "lucide-react";

import { ResourceIcon } from "@/components/resource-icon";
import type { Resource } from "@/lib/types/domain";
import { cn, resourceDisplayColor } from "@/lib/utils";

interface ResourceIconMarkProps {
  resource: Resource;
  size?: "sm" | "md";
  className?: string;
}

/** Contenedor de icono con tinte sutil del color del recurso. */
export function ResourceIconMark({
  resource,
  size = "md",
  className,
}: ResourceIconMarkProps) {
  const color = resourceDisplayColor(resource.color);

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-lg border",
        size === "sm" ? "h-7 w-7" : "h-8 w-8",
        className,
      )}
      style={{
        backgroundColor: `${color}18`,
        color,
        borderColor: `${color}35`,
      }}
    >
      <ResourceIcon
        name={resource.icon}
        className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}
      />
    </span>
  );
}

interface ResourceBadgeProps {
  resource: Resource;
  size?: "sm" | "md";
  active?: boolean;
  onClick?: () => void;
  showCheck?: boolean;
  className?: string;
}

/** Chip compacto para mostrar un recurso (sidebar, búsqueda). */
export function ResourceBadge({
  resource,
  size = "md",
  active = false,
  onClick,
  showCheck = false,
  className,
}: ResourceBadgeProps) {
  const isInteractive = Boolean(onClick);
  const Tag = isInteractive ? "button" : "span";
  const color = resourceDisplayColor(resource.color);

  return (
    <Tag
      type={isInteractive ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "relative flex w-full items-center gap-2 rounded-xl border transition-colors duration-150",
        size === "sm" ? "px-2 py-1.5" : "px-2.5 py-2",
        active
          ? "border-border-strong bg-muted/80"
          : "border-border/70 bg-surface/30 hover:border-border-strong hover:bg-surface/50",
        isInteractive && "cursor-pointer active:scale-[0.99]",
        className,
      )}
      style={
        active
          ? {
              borderColor: `${color}40`,
              background: `linear-gradient(135deg, ${color}14 0%, transparent 70%)`,
            }
          : undefined
      }
    >
      <span
        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
        style={{ backgroundColor: color, opacity: active ? 1 : 0.55 }}
        aria-hidden
      />

      <ResourceIconMark
        resource={resource}
        size={size === "sm" ? "sm" : "md"}
        className="ml-1.5"
      />

      <span
        className={cn(
          "min-w-0 flex-1 truncate font-medium leading-tight",
          size === "sm" ? "text-xs" : "text-sm",
          active ? "text-foreground" : "text-foreground/85",
        )}
      >
        {resource.name}
      </span>

      {showCheck && (
        <span
          className={cn(
            "mr-0.5 grid shrink-0 place-items-center rounded-md border transition-colors",
            size === "sm" ? "h-4 w-4" : "h-5 w-5",
            active
              ? "border-transparent text-white"
              : "border-border-strong bg-background/40",
          )}
          style={active ? { backgroundColor: color } : undefined}
        >
          {active && (
            <Check className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} />
          )}
        </span>
      )}
    </Tag>
  );
}

/** Fila de recurso para listas interactivas (filtros, búsqueda). */
export function ResourceRow({
  resource,
  active = false,
  onClick,
  trailing,
}: {
  resource: Resource;
  active?: boolean;
  onClick?: () => void;
  trailing?: React.ReactNode;
}) {
  const color = resourceDisplayColor(resource.color);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition-colors duration-150",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
      style={
        active
          ? {
              boxShadow: `inset 3px 0 0 ${color}`,
            }
          : undefined
      }
    >
      <ResourceIconMark resource={resource} size="sm" />
      <span className="flex-1 truncate text-sm font-medium">{resource.name}</span>
      {trailing}
    </button>
  );
}
