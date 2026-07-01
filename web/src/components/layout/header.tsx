import { Logo } from "@/components/logo";
import { SearchBox } from "@/components/search/search-box";
import { Badge } from "@/components/ui/badge";

/** Encabezado minimalista: logo, buscador central y acciones. */
export function Header() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 px-4 pt-4">
      <div className="glass pointer-events-auto mx-auto flex h-14 max-w-[1400px] items-center gap-3 rounded-2xl px-3 shadow-xl shadow-black/20 sm:gap-4 sm:px-4">
        <div className="shrink-0">
          <Logo />
        </div>

        <div className="mx-auto w-full max-w-md">
          <SearchBox />
        </div>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Badge className="border-primary/30 bg-primary/10 text-primary">
            Argentina
          </Badge>
        </div>
      </div>
    </header>
  );
}
