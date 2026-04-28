import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, Clock, Repeat, Dumbbell } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const EXERCISES = [
  { id: "e1", name: "Estiramiento isquiotibiales", duration: "5 min", reps: "3 series x 30s", level: "Suave", desc: "Sentado en el suelo, extiende una pierna y lleva el torso hacia adelante manteniendo la espalda recta." },
  { id: "e2", name: "Puente de glúteos", duration: "8 min", reps: "3 series x 12 reps", level: "Moderado", desc: "Acostado boca arriba, eleva la cadera contrayendo los glúteos. Mantén 2 segundos arriba." },
  { id: "e3", name: "Movilidad lumbar (gato-vaca)", duration: "5 min", reps: "2 series x 10 reps", level: "Suave", desc: "En cuatro apoyos, alterna arquear y redondear la columna de forma lenta y controlada." },
  { id: "e4", name: "Plancha frontal", duration: "3 min", reps: "3 series x 20s", level: "Intenso", desc: "Mantén el cuerpo recto apoyado en antebrazos y puntas de pies. Activa el core." },
  { id: "e5", name: "Caminata controlada", duration: "15 min", reps: "Diaria", level: "Suave", desc: "Camina a ritmo cómodo manteniendo postura erguida. Ideal para activar circulación." },
];

const HomeExercises = () => {
  const [done, setDone] = useState<string[]>(["e1", "e3"]);
  const toggle = (id: string) => setDone(d => d.includes(id) ? d.filter(x => x !== id) : [...d, id]);
  const pct = Math.round((done.length / EXERCISES.length) * 100);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container py-8 max-w-4xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand mb-4">
          <ArrowLeft className="h-4 w-4" /> Volver al dashboard
        </Link>
        <h1 className="font-display text-3xl font-bold text-navy mb-2">Ejercicios en casa</h1>
        <p className="text-muted-foreground mb-6">Rutina personalizada por tu fisioterapeuta.</p>

        <Card className="p-5 mb-6 bg-gradient-soft border-brand/20">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-navy">Progreso de hoy</div>
            <span className="text-sm font-semibold text-brand">{done.length}/{EXERCISES.length}</span>
          </div>
          <Progress value={pct} className="h-2.5" />
        </Card>

        <div className="space-y-3">
          {EXERCISES.map(ex => {
            const isDone = done.includes(ex.id);
            return (
              <Card key={ex.id} className={`p-5 shadow-card transition-smooth ${isDone ? "bg-health-soft/30 border-health/30" : ""}`}>
                <div className="flex items-start gap-4">
                  <button onClick={() => toggle(ex.id)} className="shrink-0 mt-0.5">
                    {isDone ? <CheckCircle2 className="h-6 w-6 text-health" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className={`font-semibold ${isDone ? "text-health line-through" : "text-navy"}`}>{ex.name}</div>
                      <Badge variant="secondary" className="bg-brand-soft text-brand border-0">{ex.level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{ex.desc}</p>
                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {ex.duration}</span>
                      <span className="flex items-center gap-1"><Repeat className="h-3.5 w-3.5" /> {ex.reps}</span>
                      <span className="flex items-center gap-1"><Dumbbell className="h-3.5 w-3.5" /> {ex.level}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeExercises;
