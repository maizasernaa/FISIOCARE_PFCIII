import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Home, FileText, Dumbbell } from "lucide-react";
import type { Appointment } from "@/data/mockData";

export const SessionDetailDialog = ({ apt, trigger }: { apt: Appointment; trigger: ReactNode }) => (
  <Dialog>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle className="font-display text-navy">Detalle de la sesión</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 text-sm text-foreground/80 pb-3 border-b">
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-brand" /> {new Date(apt.date).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-brand" /> {apt.time}</span>
          <span className="flex items-center gap-1.5">
            {apt.modality === "videollamada" ? <Video className="h-4 w-4 text-brand" /> : <Home className="h-4 w-4 text-brand" />}
            {apt.modality === "videollamada" ? "Videollamada" : "A domicilio"}
          </span>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Fisioterapeuta</div>
          <div className="font-semibold text-navy mt-0.5">{apt.physioName}</div>
        </div>

        {apt.notes && (
          <div className="rounded-lg bg-brand-soft/40 p-4">
            <div className="flex items-center gap-2 text-brand font-semibold text-sm mb-2">
              <FileText className="h-4 w-4" /> Notas del fisioterapeuta
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed">{apt.notes}</p>
          </div>
        )}

        {apt.exercises && apt.exercises.length > 0 && (
          <div className="rounded-lg bg-health-soft/60 p-4">
            <div className="flex items-center gap-2 text-health font-semibold text-sm mb-3">
              <Dumbbell className="h-4 w-4" /> Ejercicios recomendados
            </div>
            <ul className="space-y-2">
              {apt.exercises.map((ex, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Badge variant="secondary" className="bg-health text-health-foreground border-0 h-5 w-5 p-0 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</Badge>
                  <span className="text-foreground/85">{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Badge className="bg-health-soft text-health border-0">Sesión completada</Badge>
      </div>
    </DialogContent>
  </Dialog>
);
