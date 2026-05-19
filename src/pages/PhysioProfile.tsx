import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ShieldCheck, MapPin, Video, Home, Calendar, Award, GraduationCap, MessageCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PHYSIOS } from "@/data/mockData";
import { FAQ_ITEMS } from "@/data/faq";

const PhysioProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const physio = PHYSIOS.find(p => p.id === id);

  if (!physio) {
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
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden shadow-card">
            <div className="h-32 bg-gradient-hero" />
            <div className="px-6 pb-6 -mt-16">
              <div className="flex flex-col md:flex-row gap-5 items-start">
                <div className="relative">
                  <img src={physio.photo} alt={physio.name} className="w-32 h-32 rounded-2xl object-cover ring-4 ring-background shadow-elevated" />
                  {physio.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-health text-health-foreground rounded-full p-1.5 shadow-card">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 md:pt-16">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h1 className="font-display text-2xl md:text-3xl font-bold text-navy">{physio.name}</h1>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-semibold">{physio.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({physio.reviewCount} reseñas)</span>
                        </span>
                        {physio.verified && (
                          <Badge className="bg-health-soft text-health hover:bg-health-soft border-0">
                            <ShieldCheck className="h-3 w-3 mr-1" /> Verificado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {physio.specialties.map(s => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-6 text-foreground/80 leading-relaxed">{physio.bio}</p>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Award className="h-5 w-5 mx-auto text-brand mb-1" />
                  <div className="font-display text-xl font-bold text-navy">{physio.experience}+</div>
                  <div className="text-xs text-muted-foreground">años exp.</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <GraduationCap className="h-5 w-5 mx-auto text-brand mb-1" />
                  <div className="font-display text-sm font-bold text-navy">{physio.colegiatura}</div>
                  <div className="text-xs text-muted-foreground">colegiatura</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Star className="h-5 w-5 mx-auto text-brand mb-1" />
                  <div className="font-display text-xl font-bold text-navy">{physio.reviewCount}</div>
                  <div className="text-xs text-muted-foreground">reseñas</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Modalities & districts */}
          <Card className="p-6 shadow-card">
            <h2 className="font-display font-semibold text-navy mb-4">Modalidades y zonas</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Modalidades</h3>
                <div className="flex flex-wrap gap-2">
                  {physio.modalities.includes("domicilio") && (
                    <Badge variant="outline" className="gap-1"><Home className="h-3.5 w-3.5" /> A domicilio</Badge>
                  )}
                  {physio.modalities.includes("videollamada") && (
                    <Badge variant="outline" className="gap-1"><Video className="h-3.5 w-3.5" /> Videollamada</Badge>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Distritos atendidos</h3>
                <div className="flex flex-wrap gap-1.5">
                  {physio.districts.map(d => (
                    <Badge key={d} variant="secondary" className="text-xs"><MapPin className="h-3 w-3 mr-0.5" />{d}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Availability */}
          <Card className="p-6 shadow-card">
            <h2 className="font-display font-semibold text-navy mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand" /> Próxima disponibilidad
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {physio.availability.map((d) => {
                const date = new Date(d.date);
                return (
                  <div key={d.date} className="text-center p-3 rounded-lg border bg-muted/30">
                    <div className="text-xs text-muted-foreground uppercase">{date.toLocaleDateString('es', { weekday: 'short' })}</div>
                    <div className="font-display font-bold text-navy text-lg">{date.getDate()}</div>
                    <div className="text-xs text-health font-medium mt-1">{d.slots.length} hor.</div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Reviews */}
          <Card className="p-6 shadow-card">
            <h2 className="font-display font-semibold text-navy mb-4">Reseñas de pacientes</h2>
            <div className="space-y-5">
              {physio.reviews.map(r => (
                <div key={r.id} className="pb-5 border-b last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{r.patient}</span>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-warning text-warning' : 'text-muted'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80">{r.comment}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Booking sidebar */}
        <aside className="lg:sticky lg:top-20 self-start">
          <Card className="p-6 shadow-elevated">
            <div className="text-center pb-4 border-b">
              <div className="text-sm text-muted-foreground">Precio por sesión</div>
              <div className="font-display text-4xl font-bold text-navy mt-1">S/ {physio.pricePerSession}</div>
            </div>
            <Button variant="hero" size="lg" className="w-full mt-5" onClick={() => navigate(`/agendar/${physio.id}`)}>
              <Calendar className="h-4 w-4" /> Agendar sesión
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Pago seguro con Yape o tarjeta. Sin cargos ocultos.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default PhysioProfile;
