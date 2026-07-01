"use client";

import { AnimatePresence, motion } from "framer-motion";

interface TooltipState {
  x: number;
  y: number;
  name: string;
}

/** Capa de superposiciones del mapa: tooltip de provincia al hacer hover. */
export function MapOverlays({ tooltip }: { tooltip: TooltipState | null }) {
  return (
    <AnimatePresence>
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.12 }}
          className="glass-strong pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-lg px-2.5 py-1 text-xs font-medium text-foreground shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.name}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
