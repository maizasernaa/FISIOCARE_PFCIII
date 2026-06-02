import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShieldCheck, MapPin, Video, Home, Calendar, Award, GraduationCap, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/data/faq";
import { fetchFisioById, type FisioListItem, type Tarifa } from "@/lib/api/fisios";

const PhysioProfile = () => {
  const { id } = useParams();
  const [fisio, setFisio] = useState<FisioListItem | null>(null);
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchFisioById(id)
      .then((res) => {
        if (res) {
          setFisio(res.fisio);
          setTarifas(res.tarifas);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }

  if (!fisio) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Fisioterapeuta no encontrado</h1>
        <Button asChild><Link to="/buscar">Volver a buscar</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Link to="/buscar" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
        ← Volver a resultados
      </Link>

      <div className="grid lg:grid-cols-3 gap-8 mt-2">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden shadow-card">
            <div className="h-32 bg-gradient-hero" />
            <div className="px-6 pb-6 -mt-16">
              <div className="flex flex-col md:flex-row gap-5 items-start">
                <div className="relative">
                  <img
                    src={fisio.foto_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fisio.nombre)}`}
                    alt={fisio.nombre}
                    className="w-32 h-32 rounded-2xl object-cover ring-4 ring-background shadow-elevated bg-muted"
                  />
                  {fisio.documentos_validados && (
                    <div className="absolute -bottom-2 -right-2 bg-health text-health-foreground rounded-full p-1.5 shadow-card">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 md:pt-16">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-navy">{fisio.nombre}</h1>
                  {fisio.documentos_validados && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-health text-health-foreground text-sm font-bold uppercase tracking-wide shadow-card">
                      <ShieldCheck className="h-4 w-4" strokeWidth={3} /> Verificado
                    </div>
                  )}
                  {fisio.colegiatura && (
                    <div className="text-sm text-health font-semibold mt-1.5">
                      Colegiatura CFF · {fisio.colegiatura}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      {fisio.calificacion.toFixed(1)} ({fisio.total_resenas} reseñas)
                    </span>
                    <span className="text-muted-foreground">{fisio.anos_experiencia} años de experiencia</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {fisio.especialidades.map((e) => (
                      <Badge key={e.id} variant="secondary">{e.nombre}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {fisio.bio && (
            <Card className="p-6 shadow-card">
              <h2 className="font-display text-lg font-bold text-navy mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-brand" /> Sobre el profesional
              </h2>
              <p className="text-sm text-foreground/80 leading-relaxed">{fisio.bio}</p>
            </Card>
          )}

          <Card className="p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-navy mb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-brand" /> Cobertura y modalidades
            </h2>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
              {fisio.modalidades.includes("domicilio") && (
                <span className="flex items-center gap-1"><Home className="h-4 w-4" /> A domicilio</span>
              )}
              {fisio.modalidades.includes("videollamada") && (
                <span className="flex items-center gap-1"><Video className="h-4 w-4" /> Videollamada</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {fisio.distritos_cobertura.map((d) => (
                <Badge key={d} variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" /> {d}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-navy mb-3 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-brand" /> Preguntas frecuentes
            </h2>
            <Accordion type="single" collapsible>
              {FAQ_ITEMS.slice(0, 4).map((item, i) => (
                <AccordionItem key={i} value={`f${i}`}>
                  <AccordionTrigger className="text-sm">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6 shadow-elevated sticky top-20">
            <div className="text-center mb-4">
              <div className="text-xs text-muted-foreground">Desde</div>
              <div className="font-display text-3xl font-bold text-navy">S/ {fisio.precio_min || "—"}</div>
              <div className="text-xs text-muted-foreground">por sesión</div>
            </div>

            {tarifas.length > 0 && (
              <div className="border-t pt-3 mb-4 space-y-1.5">
                {tarifas.map((t) => (
                  <div key={t.id} className="flex justify-between text-xs">
                    <span className="capitalize text-muted-foreground">{t.modalidad}</span>
                    <span className="font-semibold">S/ {t.precio}</span>
                  </div>
                ))}
              </div>
            )}

            <Button variant="hero" size="lg" className="w-full" asChild>
              <Link to={`/reservar/${fisio.id}`}><Calendar /> Reservar sesión</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PhysioProfile;
