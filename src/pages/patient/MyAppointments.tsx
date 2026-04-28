import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Video, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_APPOINTMENTS } from "@/data/mockData";

const MyAppointments = () => {
  const upcoming = MOCK_APPOINTMENTS.filter(a => a.status === "upcoming");
  const past = MOCK_APPOINTMENTS.filter(a => a.status === "completed");

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container py-8 max-w-4xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand mb-4">
          <ArrowLeft className="h-4 w-4" /> Volver al dashboard
        </Link>
        <h1 className="font-display text-3xl font-bold text-navy mb-2">Mis citas</h1>
        <p className="text-muted-foreground mb-8">Gestiona tus sesiones programadas y revisa tu historial.</p>

        <section className="mb-8">
          <h2 className="font-display text-xl font-semibold text-navy mb-4">Próximas ({upcoming.length})</h2>
          {upcoming.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No tienes citas próximas</p>
              <Button variant="hero" asChild><Link to="/buscar">Agendar una sesión</Link></Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcoming.map(apt => (
                <Card key={apt.id} className="p-5 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-navy">{apt.physioName}</div>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(apt.date).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {apt.time}</span>
                        <span className="flex items-center gap-1.5">
                          {apt.modality === "videollamada" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                          {apt.modality === "videollamada" ? "Videollamada" : "A domicilio"}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-brand-soft text-brand border-0">S/ {apt.price}</Badge>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm">Reprogramar</Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <X className="h-4 w-4" /> Cancelar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-4">Historial ({past.length})</h2>
          <div className="space-y-3">
            {past.map(apt => (
              <Card key={apt.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-navy">{apt.physioName}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(apt.date).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })} · {apt.time}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-health-soft text-health border-0">Completada</Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyAppointments;
