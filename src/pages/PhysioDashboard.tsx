import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, DollarSign, FileText, Home, Video, Check, Clock, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/Header";
import { PHYSIO_TODAY_PATIENTS, PHYSIO_RECENT_CHATS } from "@/data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

// Predefined booked slots for visualization (rowIndex_colIndex)
const booked: Record<string, { name: string; modality: "domicilio" | "videollamada" }> = {
  "1_0": { name: "A. Gómez", modality: "domicilio" },
  "3_0": { name: "C. Ramos", modality: "videollamada" },
  "6_0": { name: "M. López", modality: "domicilio" },
  "8_0": { name: "J. Mendoza", modality: "domicilio" },
  "0_2": { name: "R. Salas", modality: "videollamada" },
  "4_3": { name: "P. Torres", modality: "domicilio" },
  "5_4": { name: "L. Quispe", modality: "videollamada" },
  "2_5": { name: "F. Vega", modality: "domicilio" },
};

const PhysioDashboard = () => {
  const [activePatient, setActivePatient] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const saveNote = () => {
    if (!note.trim()) return;
    toast.success("Nota clínica guardada");
    setNote("");
    setActivePatient(null);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container py-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-navy">Hola, Dra. Lucía 👋</h1>
            <p className="text-muted-foreground mt-1">Tienes {PHYSIO_TODAY_PATIENTS.length} pacientes hoy</p>
          </div>
          <Badge className="bg-health-soft text-health border-0 px-3 py-1.5">
            <Check className="h-3.5 w-3.5 mr-1" /> Perfil verificado
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Pacientes hoy" value="4" color="brand" />
          <StatCard icon={Calendar} label="Sesiones esta semana" value="18" color="brand" />
          <StatCard icon={DollarSign} label="Ingresos del mes" value="S/ 4,560" color="health" />
          <StatCard icon={FileText} label="Notas pendientes" value="2" color="health" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weekly agenda */}
          <Card className="lg:col-span-2 p-6 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold text-navy">Agenda semanal</h2>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-brand" /> Domicilio</span>
                <span className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-health" /> Online</span>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-1 mb-1">
                  <div />
                  {days.map(d => <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>)}
                </div>
                {hours.map((h, hi) => (
                  <div key={h} className="grid grid-cols-[60px_repeat(7,1fr)] gap-1 mb-1">
                    <div className="text-xs text-muted-foreground py-2 text-right pr-2">{h}</div>
                    {days.map((_, di) => {
                      const key = `${hi}_${di}`;
                      const slot = booked[key];
                      return (
                        <div
                          key={di}
                          className={cn(
                            "h-12 rounded-md border text-xs p-1.5 flex flex-col justify-center transition-smooth",
                            slot
                              ? slot.modality === "domicilio"
                                ? "bg-brand text-brand-foreground border-brand cursor-pointer hover:opacity-90"
                                : "bg-health text-health-foreground border-health cursor-pointer hover:opacity-90"
                              : "bg-background hover:bg-muted/60 border-border cursor-pointer"
                          )}
                        >
                          {slot && (
                            <>
                              <div className="font-semibold truncate">{slot.name}</div>
                              <div className="opacity-80 truncate text-[10px]">
                                {slot.modality === "domicilio" ? "🏠" : "📹"} {h}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Today's patients */}
          <div className="space-y-6">
            <Card className="p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-navy mb-4">Pacientes de hoy</h2>
              <div className="space-y-3">
                {PHYSIO_TODAY_PATIENTS.map(p => (
                  <div key={p.id} className="p-4 rounded-lg border bg-muted/20 hover:shadow-card transition-smooth">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{p.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{p.reason}</div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.time}</span>
                          <span className="flex items-center gap-1">
                            {p.modality === "domicilio" ? <Home className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                            {p.modality === "domicilio" ? p.district : "Online"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={activePatient === p.id ? "secondary" : "soft"}
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => setActivePatient(activePatient === p.id ? null : p.id)}
                    >
                      <FileText className="h-4 w-4" />
                      {activePatient === p.id ? "Cancelar" : "Añadir nota clínica"}
                    </Button>

                    {activePatient === p.id && (
                      <div className="mt-3 animate-fade-in">
                        <Textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Evolución, ejercicios indicados, próxima sesión..."
                          rows={3}
                          className="text-sm"
                        />
                        <Button variant="health" size="sm" className="w-full mt-2" onClick={saveNote}>
                          <Check className="h-4 w-4" /> Guardar nota
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 shadow-card bg-gradient-health text-health-foreground">
              <h3 className="font-display font-semibold text-lg">Ingresos del mes</h3>
              <div className="font-display text-4xl font-bold mt-2">S/ 4,560</div>
              <div className="text-sm text-white/85 mt-1">+18% vs. mes anterior</div>
              <div className="mt-4 pt-4 border-t border-white/15 text-xs text-white/80">
                38 sesiones · Próximo pago: viernes
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

export default PhysioDashboard;
