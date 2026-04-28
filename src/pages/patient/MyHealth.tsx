import { Link } from "react-router-dom";
import { ArrowLeft, HeartPulse, Activity, Weight, Ruler, Droplet, AlertCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MyHealth = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container py-8 max-w-4xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand mb-4">
          <ArrowLeft className="h-4 w-4" /> Volver al dashboard
        </Link>
        <h1 className="font-display text-3xl font-bold text-navy mb-2">Mi salud</h1>
        <p className="text-muted-foreground mb-8">Tus datos médicos y registros de salud.</p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <HealthMetric icon={Weight} label="Peso" value="68 kg" color="brand" />
          <HealthMetric icon={Ruler} label="Estatura" value="1.65 m" color="brand" />
          <HealthMetric icon={Droplet} label="Tipo de sangre" value="O+" color="health" />
          <HealthMetric icon={HeartPulse} label="Presión arterial" value="118/76" color="health" />
        </div>

        <Card className="p-6 shadow-card mb-6">
          <h2 className="font-display text-xl font-semibold text-navy mb-4">Diagnóstico actual</h2>
          <div className="bg-brand-soft/40 rounded-lg p-4">
            <div className="font-semibold text-navy mb-1">Lumbalgia mecánica</div>
            <p className="text-sm text-muted-foreground">Dolor lumbar de origen postural. En tratamiento desde el 15 de marzo de 2026.</p>
            <div className="flex gap-2 mt-3">
              <Badge variant="secondary" className="bg-health-soft text-health border-0">En tratamiento</Badge>
              <Badge variant="secondary" className="bg-brand-soft text-brand border-0">Sesión 3/6</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-card mb-6">
          <h2 className="font-display text-xl font-semibold text-navy mb-4">Alergias y condiciones</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <div className="font-semibold text-sm">Alergia: Ibuprofeno</div>
                <div className="text-xs text-muted-foreground">Reacción cutánea leve</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
              <Activity className="h-5 w-5 text-brand" />
              <div>
                <div className="font-semibold text-sm">Cirugía previa: Apendicectomía (2018)</div>
                <div className="text-xs text-muted-foreground">Sin complicaciones</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold text-navy mb-4">Evolución de indicadores</h2>
          <div className="space-y-4">
            <EvolutionRow label="Nivel de dolor" from="7/10" to="3/10" trend="Mejora 57%" positive />
            <EvolutionRow label="Movilidad lumbar" from="45%" to="78%" trend="Mejora 33%" positive />
            <EvolutionRow label="Calidad del sueño" from="5/10" to="8/10" trend="Mejora 30%" positive />
          </div>
        </Card>
      </div>
    </div>
  );
};

const HealthMetric = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: "brand" | "health" }) => (
  <Card className="p-5 shadow-card flex items-center gap-4">
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color === "brand" ? "bg-brand-soft text-brand" : "bg-health-soft text-health"}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-display text-xl font-bold text-navy">{value}</div>
    </div>
  </Card>
);

const EvolutionRow = ({ label, from, to, trend, positive }: { label: string; from: string; to: string; trend: string; positive?: boolean }) => (
  <div className="flex items-center justify-between p-3 rounded-lg border">
    <div>
      <div className="font-semibold text-sm text-navy">{label}</div>
      <div className="text-xs text-muted-foreground mt-0.5">De {from} → {to}</div>
    </div>
    <Badge variant="secondary" className={positive ? "bg-health-soft text-health border-0" : "bg-muted"}>{trend}</Badge>
  </div>
);

export default MyHealth;
