import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PhysioCard } from "@/components/PhysioCard";
import { PHYSIOS, LIMA_DISTRICTS, type Modality } from "@/data/mockData";
import { cn } from "@/lib/utils";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [district, setDistrict] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [minRating, setMinRating] = useState<number>(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleModality = (m: Modality) => {
    setModalities((prev) => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const results = useMemo(() => PHYSIOS.filter(p => {
    if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.specialties.some(s => s.toLowerCase().includes(query.toLowerCase()))) return false;
    if (modalities.length && !modalities.some(m => p.modalities.includes(m))) return false;
    if (district !== "all" && !p.districts.includes(district)) return false;
    if (p.pricePerSession > maxPrice) return false;
    if (p.rating < minRating) return false;
    return true;
  }), [query, modalities, district, maxPrice, minRating]);

  const clearFilters = () => {
    setModalities([]); setDistrict("all"); setMaxPrice(200); setMinRating(0); setQuery("");
  };

  const Filters = (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-semibold mb-3 block">Modalidad</Label>
        <div className="space-y-2">
          {(["domicilio", "videollamada"] as Modality[]).map(m => (
            <label key={m} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={modalities.includes(m)} onCheckedChange={() => toggleModality(m)} />
              <span className="text-sm capitalize">{m === "videollamada" ? "Videollamada" : "A domicilio"}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-semibold mb-3 block">Distrito de Lima</Label>
        <Select value={district} onValueChange={setDistrict}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los distritos</SelectItem>
            {LIMA_DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-semibold mb-3 block">Precio máximo: <span className="text-brand">S/ {maxPrice}</span></Label>
        <Slider value={[maxPrice]} onValueChange={(v) => setMaxPrice(v[0])} min={50} max={200} step={10} />
      </div>

      <div>
        <Label className="text-sm font-semibold mb-3 block">Calificación mínima</Label>
        <div className="flex gap-2">
          {[0, 4, 4.5, 4.8].map(r => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md border transition-smooth",
                minRating === r ? "bg-brand text-brand-foreground border-brand" : "bg-background hover:bg-muted"
              )}
            >
              {r === 0 ? "Todas" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        <X className="h-4 w-4" /> Limpiar filtros
      </Button>
    </div>
  );

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-2">
          Fisioterapeutas en Lima
        </h1>
        <p className="text-muted-foreground">{results.length} profesionales disponibles para ti</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o especialidad..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-12 text-base"
        />
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters - desktop */}
        <aside className="hidden lg:block w-72 shrink-0">
          <Card className="p-6 sticky top-20 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal className="h-4 w-4 text-brand" />
              <h2 className="font-display font-semibold text-navy">Filtros</h2>
            </div>
            {Filters}
          </Card>
        </aside>

        {/* Mobile filters toggle */}
        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          <Button variant="hero" size="lg" onClick={() => setFiltersOpen(true)} className="rounded-full shadow-elevated">
            <SlidersHorizontal /> Filtros
          </Button>
        </div>

        {filtersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 animate-fade-in" onClick={() => setFiltersOpen(false)}>
            <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-navy">Filtros</h2>
                <button onClick={() => setFiltersOpen(false)} className="p-2 hover:bg-muted rounded-md">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {Filters}
              <Button variant="hero" className="w-full mt-6" onClick={() => setFiltersOpen(false)}>
                Ver {results.length} resultados
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          {(modalities.length > 0 || district !== "all" || minRating > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {modalities.map(m => (
                <Badge key={m} variant="secondary" className="gap-1">
                  {m === "videollamada" ? "Videollamada" : "Domicilio"}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleModality(m)} />
                </Badge>
              ))}
              {district !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {district} <X className="h-3 w-3 cursor-pointer" onClick={() => setDistrict("all")} />
                </Badge>
              )}
              {minRating > 0 && (
                <Badge variant="secondary" className="gap-1">
                  ★ {minRating}+ <X className="h-3 w-3 cursor-pointer" onClick={() => setMinRating(0)} />
                </Badge>
              )}
            </div>
          )}

          {results.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No encontramos fisioterapeutas con esos filtros.</p>
              <Button variant="outline" onClick={clearFilters}>Limpiar filtros</Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {results.map(p => <PhysioCard key={p.id} physio={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
