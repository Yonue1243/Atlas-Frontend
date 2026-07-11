"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Layers, Ruler, Users, X } from "lucide-react";
import { useMemo } from "react";

import { useAppState } from "@/components/providers/app-state";
import { ResourceBadge } from "@/components/resources/resource-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCategories,
  useProvinces,
  useResources,
} from "@/lib/query/hooks";
import type { Category, Resource } from "@/lib/types/domain";
import { formatNumber } from "@/lib/utils";

/** Panel lateral con el detalle de la provincia seleccionada. */
export function ProvincePanel() {
  const { countryId, selectedProvinceId, selectProvince } = useAppState();
  const { data: provinces = [], isLoading: loadingProvinces } =
    useProvinces(countryId);
  const { data: resources = [] } = useResources();
  const { data: categories = [] } = useCategories();

  const province = provinces.find((p) => p.id === selectedProvinceId) ?? null;

  const grouped = useMemo(() => {
    if (!province) return [];
    const byId = new Map(resources.map((r) => [r.id, r]));
    const owned = province.resourceIds
      .map((id) => byId.get(id))
      .filter((r): r is Resource => Boolean(r));

    return categories
      .map((category) => ({
        category,
        items: owned.filter((r) => r.categoryId === category.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [province, resources, categories]);

  const open = Boolean(selectedProvinceId);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="province-panel"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          className="glass-strong scroll-area pointer-events-auto absolute right-4 top-[84px] bottom-4 z-20 w-[calc(100%-2rem)] max-w-[380px] overflow-y-auto rounded-3xl p-5 shadow-2xl shadow-black/40 sm:w-[380px]"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              {province ? (
                <>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {province.name}
                  </h2>
                  <Badge className="mt-2 border-primary/30 bg-primary/10 text-primary">
                    {province.region}
                  </Badge>
                </>
              ) : (
                <Skeleton className="h-7 w-40" />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cerrar panel"
              onClick={() => selectProvince(null)}
            >
              <X className="h-[18px] w-[18px]" />
            </Button>
          </div>

          {loadingProvinces || !province ? (
            <PanelSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Stat
                  icon={<Ruler className="h-4 w-4" />}
                  label="Superficie"
                  value={`${formatNumber(province.area)} km²`}
                />
                <Stat
                  icon={<Users className="h-4 w-4" />}
                  label="Población"
                  value={formatNumber(province.population)}
                />
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground">
                <Layers className="h-4 w-4 text-muted-foreground" />
                Recursos naturales
              </div>

              <div className="mt-3 space-y-5">
                {grouped.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Sin recursos registrados para esta provincia.
                  </p>
                )}
                {grouped.map(({ category, items }) => (
                  <ResourceGroup
                    key={category.id}
                    category={category}
                    items={items}
                  />
                ))}
              </div>
            </>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ResourceGroup({
  category,
  items,
}: {
  category: Category;
  items: Resource[];
}) {
  return (
    <div>
      <p className="mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {category.name}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((resource) => (
          <ResourceBadge key={resource.id} resource={resource} size="sm" />
        ))}
      </div>
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <Skeleton className="h-4 w-32" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    </div>
  );
}
