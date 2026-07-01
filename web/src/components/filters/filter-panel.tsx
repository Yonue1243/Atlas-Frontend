"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { useAppState } from "@/components/providers/app-state";
import { ResourceIcon } from "@/components/resource-icon";
import { Button } from "@/components/ui/button";
import { useCategories, useResources } from "@/lib/query/hooks";
import type { Resource } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

/** Panel de filtros: resalta en el mapa las provincias con los recursos activos. */
export function FilterPanel() {
  const { activeResourceIds, toggleResource, clearResources } = useAppState();
  const { data: resources = [] } = useResources();
  const { data: categories = [] } = useCategories();
  const [open, setOpen] = useState(true);

  const grouped = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          items: resources.filter((r) => r.categoryId === category.id),
        }))
        .filter((group) => group.items.length > 0),
    [categories, resources],
  );

  const activeCount = activeResourceIds.size;

  return (
    <>
      {!open && (
        <div className="pointer-events-auto absolute left-4 top-[84px] z-20">
          <Button
            variant="secondary"
            onClick={() => setOpen(true)}
            className="glass-strong shadow-xl shadow-black/30"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeCount > 0 && (
              <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="glass-strong scroll-area pointer-events-auto absolute left-4 top-[84px] z-20 flex max-h-[calc(100%-104px)] w-[300px] max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-3xl shadow-2xl shadow-black/40"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  Filtros
                </span>
                {activeCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                    {activeCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {activeCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearResources}>
                    Limpiar
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Cerrar filtros"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="scroll-area flex-1 overflow-y-auto px-3 py-3">
              <div className="space-y-4">
                {grouped.map(({ category, items }) => (
                  <div key={category.id}>
                    <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {category.name}
                    </p>
                    <div className="space-y-0.5">
                      {items.map((resource) => (
                        <ResourceToggle
                          key={resource.id}
                          resource={resource}
                          active={activeResourceIds.has(resource.id)}
                          onToggle={() => toggleResource(resource.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

function ResourceToggle({
  resource,
  active,
  onToggle,
}: {
  resource: Resource;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left text-sm transition-colors",
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      <span
        className="grid h-6 w-6 shrink-0 place-items-center rounded-lg"
        style={{ backgroundColor: `${resource.color}1f`, color: resource.color }}
      >
        <ResourceIcon name={resource.icon} className="h-3.5 w-3.5" />
      </span>
      <span className="flex-1 truncate">{resource.name}</span>
      <span
        className={cn(
          "grid h-4 w-4 shrink-0 place-items-center rounded-md border transition-colors",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border-strong",
        )}
      >
        {active && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}
