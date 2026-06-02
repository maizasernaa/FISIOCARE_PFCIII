import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, X, Star, ShieldCheck, Home, Video, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LIMA_DISTRICTS } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { fetchEspecialidades, fetchFisios, type Especialidad, type FisioListItem } from "@/lib/api/fisios";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [modalities, setModalities] = useState<string[]>([]);
  const [district, setDistrict] = useState<string>("all");
  const [especialidadId, setEspecialidadId] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [fisios, setFisios] = useState<FisioListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchEspecialidades(), fetchFisios()])
      .then(([esps, fs]) => {
        setEspecialidades(esps);
        setFisios(fs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleModality = (m: string) => {
    setModalities((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const results = useMemo(
    () =>
      fisios.filter((f) => {
        if (
          query &&
          !f.nombre.toLowerCase().includes(query.toLowerCase()) &&
          !f.especialidades.some((e) => e.nombre.toLowerCase().includes(query.toLowerCase()))
        )
          return false;
        if (modalities.length && !modalities.some((m) => f.modalidades.includes(m))) return false;
        if (district !== "all" && !f.distritos_cobertura.includes(district)) return false;
        if (especialidadId !== "all" && !f.especialidades.some((e) => e.id === especialidadId)) return false;
        if (f.precio_min > 0 && f.precio_min > maxPrice) return false;
        return true;
      }),
    [fisios, query, modalities, district, especialidadId, maxPrice]
  );

  const clearFilters = () => {
    setModalities([]);
    setDistrict("all");
    setEspecialidadId("all");
    setMaxPrice(300);
    setQuery("");
  };

  const Filters = (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-semibold mb-3 block">Modalidad</Label>
        <div className="space-y-2">
          {["domicilio", "videollamada"].map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={modalities.includes(m)} onCheckedChange={() => toggleModality(m)} />
              <span className="text-sm capitalize">{m === "videollamada" ? "Videollamada" : "A domicilio"}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-semibold mb-3 block">Especialidad</Label>
        <Select value={especialidadId} onValueChange={setEspecialidadId}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las especialidades</SelectItem>
            {especialidades.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-semibold mb-3 block">Distrito de Lima</Label>
        <Select value={district} onValueChange={setDistrict}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los distritos</SelectItem>
            {LIMA_DISTRICTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-semibold mb-3 block">
          Precio máximo: <span className="text-brand">S/ {maxPrice}</span>
        </Label>
        <Slider value={[maxPrice]} onValueChange={(v) => setMaxPrice(v[0])} min={30} max={500} step={10} />
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        <X className="h-4 w-4" /> Limpiar filtros
      </Button>
    </div>
  );

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-2">Especialistas en Lima</h1>
        <p className="text-muted-foreground">
          {loading ? "Cargando…" : `${results.length} profesionales disponibles para ti`}
        </p>
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
        <aside className="hidden lg:block w-72 shrink-0">
          <Card className="p-6 sticky top-20 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal className="h-4 w-4 text-brand" />
              <h2 className="font-display font-semibold text-navy">Filtros</h2>
            </div>
            {Filters}
          </Card>
        </aside>

        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          <Button variant="hero" size="lg" onClick={() => setFiltersOpen(true)} className="rounded-full shadow-elevated">
            <SlidersHorizontal /> Filtros
          </Button>
        </div>

        {filtersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 animate-fade-in" onClick={() => setFiltersOpen(false)}>
            <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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

        <div className="flex-1 min-w-0">
          {(modalities.length > 0 || district !== "all" || especialidadId !== "all") && (
            <div className="flex flex-wrap gap-2 mb-4">
              {modalities.map((m) => (
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
              {especialidadId !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {especialidades.find((e) => e.id === especialidadId)?.nombre}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setEspecialidadId("all")} />
                </Badge>
              )}
            </div>
          )}

          {loading ? (
            <Card className="p-12 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
            </Card>
          ) : results.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-2">
                {fisios.length === 0
                  ? "Aún no hay fisioterapeutas registrados. ¡Sé el primero!"
                  : "No encontramos fisioterapeutas con esos filtros."}
              </p>
              {fisios.length === 0 ? (
                <Button variant="hero" asChild>
                  <Link to="/registro-fisio">Únete como profesional</Link>
                </Button>
              ) : (
                <Button variant="outline" onClick={clearFilters}>Limpiar filtros</Button>
              )}
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {results.map((f) => <DbPhysioCard key={f.id} f={f} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DbPhysioCard = ({ f }: { f: FisioListItem }) => (
  <Card className="overflow-hidden shadow-card hover:shadow-elevated transition-smooth">
    <div className="p-5 flex gap-4">
      <div className="relative shrink-0">
        <img
          src={f.foto_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(f.nombre)}`}
          alt={f.nombre}
          className="w-24 h-24 rounded-xl object-cover ring-2 ring-brand-soft bg-muted"
        />
        {f.documentos_validados && (
          <div className="absolute -bottom-1.5 -right-1.5 bg-health text-health-foreground rounded-full p-1.5 shadow-elevated ring-2 ring-background">
            <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-navy truncate">{f.nombre}</h3>
            {f.colegiatura && (
              <div className="text-[11px] text-health font-medium mt-1 truncate">CFTP: {f.colegiatura}</div>
            )}
            <div className="flex items-center gap-1 mt-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="font-medium">{f.calificacion.toFixed(1)}</span>
              <span className="text-muted-foreground">({f.total_resenas})</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-display font-bold text-navy">
              {f.precio_min > 0 ? `S/ ${f.precio_min}` : "—"}
            </div>
            <div className="text-xs text-muted-foreground">desde</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {f.especialidades.map((e) => (
            <Badge key={e.id} variant="secondary" className="text-xs font-normal">{e.nombre}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
          {f.modalidades.includes("domicilio") && (
            <span className="flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Domicilio</span>
          )}
          {f.modalidades.includes("videollamada") && (
            <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5" /> Online</span>
          )}
          {f.distritos_cobertura.length > 0 && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3.5 w-3.5" /> {f.distritos_cobertura.slice(0, 2).join(", ")}
            </span>
          )}
        </div>
      </div>
    </div>

    <div className="px-5 pb-5">
      <Button variant="brand" className="w-full" asChild>
        <Link to={`/reservar/${f.id}`}>Reservar sesión</Link>
      </Button>
    </div>
  </Card>
);

export default SearchPage;
