/** Pie de página discreto, sobre el mapa. */
export function Footer() {
  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden justify-center px-4 pb-3 sm:flex">
      <div className="glass pointer-events-auto flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] text-muted-foreground shadow-lg shadow-black/20">
        <span>Atlas</span>
        <span className="text-border-strong">•</span>
        <span>Exploración educativa de recursos naturales</span>
        <span className="text-border-strong">•</span>
        <span>Datos: IGN / Georef</span>
      </div>
    </footer>
  );
}
