import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, X, RefreshCw, AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

export const CancellationPolicyDialog = ({ trigger }: { trigger: ReactNode }) => (
  <Dialog>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 font-display text-navy">
          <ShieldCheck className="h-5 w-5 text-health" /> Política de cancelaciones
        </DialogTitle>
        <DialogDescription>
          Antes de confirmar tu reserva, revisa cómo manejamos los cambios.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="rounded-lg border bg-health-soft/40 p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-health shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-navy text-sm">Si tú cancelas</div>
              <ul className="mt-1.5 text-sm text-foreground/80 space-y-1 list-disc pl-4">
                <li><strong>Más de 12 h antes:</strong> 100% sin costo.</li>
                <li><strong>Entre 12 h y 2 h antes:</strong> se cobra el 50%.</li>
                <li><strong>Menos de 2 h o no asistes:</strong> se cobra el 100%.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-brand-soft/50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-navy text-sm">Si el fisio cancela a último momento</div>
              <p className="mt-1.5 text-sm text-foreground/80">
                Recibes el <strong>reembolso completo</strong> de inmediato y un <strong>cupón del 20%</strong> para tu próxima sesión. Si lo prefieres, te ayudamos a contactar a otro fisio disponible.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex items-start gap-3">
            <RefreshCw className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-navy text-sm">Reagendar</div>
              <p className="mt-1.5 text-sm text-foreground/80">
                Puedes reagendar <strong>sin costo</strong> hasta 12 h antes desde "Mis citas" en tu panel. Solo elige un nuevo horario disponible del mismo fisio.
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="hero" className="w-full">Entendido</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
