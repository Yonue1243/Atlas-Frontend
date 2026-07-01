import { FilterPanel } from "@/components/filters/filter-panel";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MapView } from "@/components/map/map-view";
import { ProvincePanel } from "@/components/sidebar/province-panel";

/**
 * Pantalla principal: el mapa es el protagonista absoluto. El resto de la UI
 * (header, filtros, sidebar y footer) flota por encima.
 */
export default function HomePage() {
  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <MapView />
      <Header />
      <FilterPanel />
      <ProvincePanel />
      <Footer />
    </main>
  );
}
