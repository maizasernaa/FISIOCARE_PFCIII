import { Link } from "react-router-dom";
import { Calendar, Clock, Home, Video, FileText, Activity, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_APPOINTMENTS, PHYSIOS } from "@/data/mockData";
import { Header } from "@/components/layout/Header";

const PatientDashboard = () => {
  const upcoming = MOCK_APPOINTMENTS.filter(a => a.status === "upcoming");
  const completed = MOCK_APPOINTMENTS.filter(a => a.status === "completed");
  const next = upcoming[0];
  const nextPhysio = next ? PHYSIOS.find(p => p.id === next.physioId) : null;

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy">Hola, María 👋</h1>
          <p className="text-muted-foreground mt-1">Aquí está el resumen de tu recuperación</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Calendar} label="Próximas" value={upcoming.length.toString()} color="brand" />
          <StatCard icon={Activity} label="Completadas" value={completed.length.toString()} color="health" />
          <StatCard icon={FileText} label="Notas clínicas" value={completed.filter(c => c.notes).length.toString()} color="brand" />
          <StatCard icon={Clock} label="Próx. en" value={next ? "2 días" : "—"} color="health" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Next session */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-navy">Próxima sesión</h2>
                <Button variant="soft" size="sm" asChild>
                  <Link to="/buscar"><Plus className="h-4 w-4" /> Agendar</Link>
                </Button>
              </div>

              {next && nextPhysio ? (
                <div className="bg-gradient-soft rounded-xl p-5 border border-brand/10">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img src={nextPhysio.photo} alt={nextPhysio.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="font-display font-semibold text-navy text-lg">{nextPhysio.name}</div>
                      <div className="text-sm text-muted-foreground">{nextPhysio.specialties.join(" • ")}</div>
                      <div className="flex flex-wrap gap-3 mt-3 text-sm">
                        <span className="flex items-center gap-1.5 text-foreground">
                          <Calendar className="h-4 w-4 text-brand" />
                          {new Date(next.date).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                        <span className="flex items-center gap-1.5 text-foreground">
                          <Clock className="h-4 w-4 text-brand" />{next.time}
                        </span>
                        <span className="flex items-center gap-1.5 text-foreground">
                          {next.modality === "domicilio" ? <Home className="h-4 w-4 text-brand" /> : <Video className="h-4 w-4 text-brand" />}
                          {next.modality === "domicilio" ? "Domicilio" : "Videollamada"}
                        </span>
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2">
                      <Button variant="outline" size="sm">Reprogramar</Button>
                      <Button variant="hero" size="sm" asChild><Link to={`/fisio/${nextPhysio.id}`}>Ver perfil</Link></Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No tienes sesiones próximas.</div>
              )}
            </Card>

            {/* History */}
            <Card className="p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-navy mb-4">Historial de citas</h2>
              <div className="space-y-3">
                {completed.map(apt => (
                  <div key={apt.id} className="p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-smooth">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="font-semibold text-sm">{apt.physioName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {new Date(apt.date).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })} · {apt.time}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-health-soft text-health border-0">Completada</Badge>
                    </div>
                    {apt.notes && (
                      <div className="mt-3 pt-3 border-t border-border/60 flex gap-2">
                        <FileText className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-brand mb-1">Nota del fisioterapeuta</div>
                          <p className="text-sm text-foreground/80 leading-relaxed">{apt.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 shadow-card bg-gradient-hero text-primary-foreground">
              <h3 className="font-display font-semibold text-lg mb-2">Tu recuperación</h3>
              <p className="text-sm text-white/80 mb-4">Llevas 3 sesiones completadas este mes. ¡Sigue así!</p>
              <div className="bg-white/15 rounded-lg p-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span>Plan de tratamiento</span>
                  <span>3/6</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="font-display font-semibold text-navy mb-4">Acciones rápidas</h3>
              <div className="space-y-2">
                <QuickAction to="/buscar" label="Buscar fisioterapeuta" />
                <QuickAction to="/dashboard" label="Mis notas clínicas" />
                <QuickAction to="/" label="Centro de ayuda" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: "brand" | "health" }) => (
  <Card className="p-5 shadow-card">
    <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${color === "brand" ? "bg-brand-soft text-brand" : "bg-health-soft text-health"}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="font-display text-2xl font-bold text-navy">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </Card>
);

const QuickAction = ({ to, label }: { to: string; label: string }) => (
  <Link to={to} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-smooth text-sm">
    <span>{label}</span>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </Link>
);

export default PatientDashboard;
