import { Link } from "react-router-dom";
import { ShieldCheck, CalendarCheck, MapPin, Search, UserCheck, HeartPulse, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImg from "@/assets/hero-fisiocare.jpg";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Profesionales verificados",
    description: "Todos nuestros fisioterapeutas tienen colegiatura validada y documentación al día.",
  },
  {
    icon: MapPin,
    title: "A domicilio o por video",
    description: "Atención en tu hogar en Lima o sesiones online desde donde estés.",
  },
  {
    icon: HeartPulse,
    title: "Cuidado personalizado",
    description: "Reseñas reales, especialidades claras y precios transparentes para elegir mejor.",
  },
];

const steps = [
  { icon: Search, title: "Busca", desc: "Filtra por modalidad, distrito, precio y especialidad." },
  { icon: UserCheck, title: "Elige y agenda", desc: "Revisa perfiles, reseñas y reserva el horario que prefieras." },
  { icon: CalendarCheck, title: "Recibe tu sesión", desc: "Paga seguro con Yape o tarjeta y empieza tu recuperación." },
];

const Landing = () => (
  <>
    <section className="relative overflow-hidden bg-gradient-soft">
      <div className="container py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-health-soft text-health text-xs font-medium mb-6">
            <ShieldCheck className="h-3.5 w-3.5" />
            Fisioterapeutas verificados en Lima
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy leading-[1.1]">
            Encuentra tu fisioterapeuta verificado, <span className="text-brand">donde estés</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Reserva sesiones a domicilio o por videollamada con profesionales colegiados.
            Recupérate con confianza, en tus tiempos.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="hero" size="xl" asChild>
              <Link to="/buscar">
                Soy paciente <ArrowRight className="ml-1" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/registro-fisio">Soy fisioterapeuta</Link>
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-hero ring-2 ring-background" />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />)}
                <span className="ml-1 font-semibold text-foreground">4.9</span>
              </div>
              <span className="text-xs">+2,000 sesiones realizadas</span>
            </div>
          </div>
        </div>

        <div className="relative animate-scale-in">
          <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
          <img
            src={heroImg}
            alt="Sesión de fisioterapia profesional"
            width={1536}
            height={1024}
            className="relative rounded-2xl shadow-elevated object-cover w-full aspect-[4/3]"
          />
          <Card className="absolute -bottom-6 -left-6 p-4 shadow-elevated hidden md:block animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-health-soft flex items-center justify-center">
                <CalendarCheck className="h-5 w-5 text-health" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Próxima sesión</div>
                <div className="font-semibold text-sm">Mañana 11:00 — Domicilio</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="container py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">¿Por qué FisioCare?</h2>
        <p className="mt-3 text-muted-foreground">Diseñado para que tu recuperación sea simple y segura.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {benefits.map((b) => (
          <Card key={b.title} className="p-7 shadow-card hover:shadow-elevated transition-smooth border-border/60">
            <div className="h-12 w-12 rounded-xl bg-brand-soft text-brand flex items-center justify-center mb-5">
              <b.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-navy mb-2">{b.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
          </Card>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section id="como-funciona" className="bg-gradient-soft py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Cómo funciona</h2>
          <p className="mt-3 text-muted-foreground">En 3 simples pasos estás en sesión.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((s, i) => (
            <Card key={s.title} className="p-7 text-center shadow-card relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-gradient-hero text-primary-foreground font-display font-bold flex items-center justify-center shadow-card">
                {i + 1}
              </div>
              <div className="h-14 w-14 mx-auto rounded-2xl bg-health-soft text-health flex items-center justify-center mt-2 mb-4">
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-lg font-semibold text-navy mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* CTA dual */}
    <section className="container py-20">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-10 bg-gradient-hero text-primary-foreground shadow-elevated overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">¿Necesitas atención?</h3>
            <p className="text-white/85 mb-6">Encuentra al fisio ideal para ti en minutos.</p>
            <Button size="lg" className="bg-white text-navy hover:bg-white/90" asChild>
              <Link to="/buscar">Buscar fisioterapeutas</Link>
            </Button>
          </div>
        </Card>
        <Card className="p-10 bg-gradient-health text-health-foreground shadow-elevated overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">¿Eres fisioterapeuta?</h3>
            <p className="text-white/85 mb-6">Crece tu consulta con pacientes que te buscan.</p>
            <Button size="lg" className="bg-white text-health hover:bg-white/90" asChild>
              <Link to="/registro-fisio">Quiero registrarme</Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  </>
);

export default Landing;
