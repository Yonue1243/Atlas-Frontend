"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { ResourceRow } from "@/components/resources/resource-badge";
import { useAppState } from "@/components/providers/app-state";
import { Input } from "@/components/ui/input";
import { useProvinces, useResources } from "@/lib/query/hooks";
import type { Province, Resource } from "@/lib/types/domain";
import { cn, normalize } from "@/lib/utils";

const MAX_RESULTS = 6;

/** Buscador rápido de provincias y recursos con resultados en vivo. */
export function SearchBox() {
  const { countryId, selectProvince, toggleResource, activeResourceIds } =
    useAppState();
  const { data: provinces = [] } = useProvinces(countryId);
  const { data: resources = [] } = useResources();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { provinceMatches, resourceMatches } = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) {
      return { provinceMatches: [] as Province[], resourceMatches: [] as Resource[] };
    }
    return {
      provinceMatches: provinces
        .filter((p) => normalize(p.name).includes(q))
        .slice(0, MAX_RESULTS),
      resourceMatches: resources
        .filter((r) => normalize(r.name).includes(q))
        .slice(0, MAX_RESULTS),
    };
  }, [query, provinces, resources]);

  const hasResults =
    provinceMatches.length > 0 || resourceMatches.length > 0;
  const showDropdown = open && query.trim().length > 0;

  function reset() {
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }

  function onSelectProvince(id: string) {
    selectProvince(id);
    reset();
  }

  function onSelectResource(id: string) {
    toggleResource(id);
    reset();
  }

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "Escape") reset();
          if (e.key === "Enter") {
            if (provinceMatches[0]) onSelectProvince(provinceMatches[0].id);
            else if (resourceMatches[0])
              onSelectResource(resourceMatches[0].id);
          }
        }}
        placeholder="Buscar provincia o recurso…"
        className="pl-9 pr-9"
        aria-label="Buscar provincia o recurso"
      />
      {query && (
        <button
          type="button"
          onClick={reset}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="glass-strong scroll-area absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[60vh] overflow-y-auto rounded-2xl p-1.5 shadow-2xl shadow-black/40"
          >
            {!hasResults && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Sin resultados para “{query}”
              </p>
            )}

            {provinceMatches.length > 0 && (
              <Section label="Provincias">
                {provinceMatches.map((p) => (
                  <ResultRow
                    key={p.id}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSelectProvince(p.id)}
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="flex-1 truncate">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {p.region}
                    </span>
                  </ResultRow>
                ))}
              </Section>
            )}

            {resourceMatches.length > 0 && (
              <Section label="Recursos">
                {resourceMatches.map((r) => {
                  const active = activeResourceIds.has(r.id);
                  return (
                    <div
                      key={r.id}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <ResourceRow
                        resource={r}
                        active={active}
                        onClick={() => onSelectResource(r.id)}
                        trailing={
                          <span
                            className={cn(
                              "text-xs",
                              active ? "text-primary" : "text-muted-foreground",
                            )}
                          >
                            {active ? "Activo" : "Filtrar"}
                          </span>
                        }
                      />
                    </div>
                  );
                })}
              </Section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-1">
      <p className="px-3 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function ResultRow({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
      {...props}
    >
      {children}
    </button>
  );
}
