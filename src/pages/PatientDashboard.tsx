import { Link } from "react-router-dom";
import { Calendar, Clock, FileText, Activity, ChevronRight, Search, HeartPulse, TrendingUp, Target, BookOpen, MessageSquare, Bell, MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MOCK_APPOINTMENTS, RECENT_CHATS } from "@/data/mockData";
import { Header } from "@/components/layout/Header";
import { SessionDetailDialog } from "@/components/SessionDetailDialog";

const PatientDashboard = () => {
  const upcoming = MOCK_APPOINTMENTS.filter(a => a.status === "upcoming");
  const completed = MOCK_APPOINTMENTS.filter(a => a.status === "completed");
  const totalPlan = 6;
  const progressPct = Math.round((completed.length / totalPlan) * 100);
  const unreadChats = RECENT_CHATS.reduce((s, c) => s + c.unread, 0);

  // Find appointment within next 24h for reminder banner
  const now = Date.now();
  const next24h = upcoming.find(a => {
    const apt = new Date(`${a.date}T${a.time}:00`).getTime();
    return apt > now && apt - now <= 24 * 60 * 60 * 1000;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy">Hola, María 👋</h1>
          <p className="text-muted-foreground mt-1">Aquí está el resumen de tu recuperación</p>
        </div>

        {/* 24h reminder banner */}
        {next24h && (
          <Card className="mb-6 p-4 md:p-5 border-l-4 border-l-warning bg-warning/5 shadow-card animate-fade-in">
            <div className="flex items-start gap-3 flex-wrap">
              <div className="h-10 w-10 rounded-lg bg-warning/15 text-warning flex items-center justify-center shrink-0">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="font-semibold text-navy">Recordatorio: tienes una sesión en las próximas 24 horas</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {next24h.physioName} · {new Date(next24h.date).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })} · {next24h.time} · {next24h.modality === "videollamada" ? "Videollamada" : "A domicilio"}
                </div>
                <div className="text-xs text-muted-foreground mt-1.5">
                  Te enviaremos también un recordatorio por WhatsApp y correo.
                </div>
              </div>
              <Button variant="hero" size="sm" asChild>
                <Link to="/dashboard/citas">Ver cita</Link>
              </Button>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Calendar} label="Próximas" value={upcoming.length.toString()} color="brand" />
          <StatCard icon={Activity} label="Completadas" value={completed.length.toString()} color="health" />
          <StatCard icon={FileText} label="Notas clínicas" value={completed.filter(c => c.notes).length.toString()} color="brand" />
          <StatCard icon={TrendingUp} label="Progreso" value={`${progressPct}%`} color="health" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Menú principal del paciente + avance */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-semibold text-navy">Mi avance</h2>
                <Badge variant="secondary" className="bg-health-soft text-health border-0">
                  {completed.length} de {totalPlan} sesiones
                </Badge>
              </div>

              <div className="bg-gradient-soft rounded-xl p-5 border border-brand/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-navy">Plan de tratamiento</div>
                    <div className="text-xs text-muted-foreground">Recuperación lumbar</div>
                  </div>
                </div>
                <Progress value={progressPct} className="h-2.5" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Inicio</span>
                  <span className="font-semibold text-brand">{progressPct}% completado</span>
                  <span>Meta</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mt-5">
                <MiniStat icon={HeartPulse} label="Dolor" value="3/10" trend="-2" />
                <MiniStat icon={Activity} label="Movilidad" value="78%" trend="+12" />
                <MiniStat icon={Calendar} label="Asistencia" value="100%" trend="" />
              </div>
            </Card>

            {/* Menú principal */}
            <Card className="p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-navy mb-4">Menú principal</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <MenuItem to="/buscar" icon={Search} title="Buscar fisioterapeuta" desc="Agenda una nueva sesión" color="brand" />
                <MenuItem to="/dashboard/citas" icon={Calendar} title="Mis citas" desc={`${upcoming.length} próximas programadas`} color="health" />
                <MenuItem to="/dashboard/notas" icon={FileText} title="Notas clínicas" desc="Recomendaciones de tu fisio" color="brand" />
                <MenuItem to="/dashboard/ejercicios" icon={BookOpen} title="Ejercicios en casa" desc="Rutinas asignadas para ti" color="health" />
                <MenuItem to="/dashboard/mensajes" icon={MessageSquare} title="Mensajes" desc="Conversa con tu profesional" color="brand" />
                <MenuItem to="/dashboard/salud" icon={HeartPulse} title="Mi salud" desc="Historial y registros" color="health" />
              </div>
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

const MiniStat = ({ icon: Icon, label, value, trend }: { icon: any; label: string; value: string; trend: string }) => (
  <div className="rounded-lg border border-border/60 bg-background p-3">
    <div className="flex items-center gap-2 text-muted-foreground text-xs">
      <Icon className="h-3.5 w-3.5" /> {label}
    </div>
    <div className="flex items-end justify-between mt-1">
      <div className="font-display text-lg font-bold text-navy">{value}</div>
      {trend && <span className="text-xs font-semibold text-health">{trend}</span>}
    </div>
  </div>
);

const MenuItem = ({ to, icon: Icon, title, desc, color }: { to: string; icon: any; title: string; desc: string; color: "brand" | "health" }) => (
  <Link
    to={to}
    className="group flex items-start gap-3 p-4 rounded-xl border border-border/60 hover:border-brand/40 hover:shadow-card transition-smooth bg-background"
  >
    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${color === "brand" ? "bg-brand-soft text-brand" : "bg-health-soft text-health"}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-sm text-navy">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
    </div>
    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-smooth shrink-0" />
  </Link>
);

export default PatientDashboard;
