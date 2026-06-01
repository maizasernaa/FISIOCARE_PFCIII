import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Home, Video, Check, CreditCard, Smartphone, ShieldCheck, ArrowLeft, ArrowRight, Calendar, MessageCircle, Mail, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PHYSIOS, type Modality } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CancellationPolicyDialog } from "@/components/CancellationPolicyDialog";
import { supabase } from "@/integrations/supabase/client";

type Step = 1 | 2 | 3 | 4 | 5;

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const physio = PHYSIOS.find(p => p.id === id);

  const [step, setStep] = useState<Step>(1);
  const [modality, setModality] = useState<Modality | null>(null);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [payment, setPayment] = useState<"yape" | "card" | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [saving, setSaving] = useState(false);

  if (!physio) {
    return <div className="container py-20 text-center">No encontrado</div>;
  }

  const steps = ["Modalidad", "Fecha y hora", "Resumen", "Pago", "Confirmación"];

  const next = () => setStep((s) => Math.min(5, s + 1) as Step);
  const back = () => setStep((s) => Math.max(1, s - 1) as Step);

  const canNext =
    (step === 1 && modality) ||
    (step === 2 && date && time) ||
    (step === 3 && nombre.trim().length >= 2 && telefono.trim().length >= 6) ||
    (step === 4 && payment);

  const handlePay = async () => {
    setSaving(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const { error } = await supabase.from("citas").insert({
        user_id: sess.session?.user.id ?? null,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        fecha: date,
        hora: time,
        especialidad: physio.specialties[0] ?? "General",
        fisioterapeuta: physio.name,
        modalidad: modality,
      });
      if (error) throw error;
      toast.success("¡Pago confirmado y cita guardada!");
      setStep(5);
    } catch (err: any) {
      toast.error(err?.message || "No se pudo guardar la cita");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <Link to={`/fisio/${physio.id}`} className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Volver al perfil
      </Link>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((label, i) => {
            const num = (i + 1) as Step;
            const done = step > num;
            const active = step === num;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-smooth",
                  done ? "bg-health text-health-foreground" : active ? "bg-brand text-brand-foreground shadow-card" : "bg-muted text-muted-foreground"
                )}>
                  {done ? <Check className="h-4 w-4" /> : num}
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("flex-1 h-0.5 mx-2", step > num ? "bg-health" : "bg-muted")} />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {steps.map((l) => <span key={l} className="flex-1 text-center first:text-left last:text-right">{l}</span>)}
        </div>
      </div>

      <Card className="p-6 md:p-8 shadow-elevated min-h-[400px]">
        {/* Physio summary header */}
        <div className="flex items-center gap-3 pb-5 mb-6 border-b">
          <img src={physio.photo} alt={physio.name} className="w-12 h-12 rounded-lg object-cover" />
          <div className="flex-1">
            <div className="font-display font-semibold text-navy">{physio.name}</div>
            <div className="text-xs text-muted-foreground">{physio.specialties.join(" • ")}</div>
          </div>
          <div className="text-right">
            <div className="font-display font-bold text-navy">S/ {physio.pricePerSession}</div>
            <div className="text-xs text-muted-foreground">/ sesión</div>
          </div>
        </div>

        {/* Step 1: Modality */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-xl font-bold text-navy mb-1">Elige la modalidad</h2>
            <p className="text-sm text-muted-foreground mb-6">¿Cómo prefieres tu sesión?</p>
            <div className="grid md:grid-cols-2 gap-4">
              {physio.modalities.includes("domicilio") && (
                <button
                  onClick={() => setModality("domicilio")}
                  className={cn(
                    "p-6 rounded-xl border-2 text-left transition-smooth",
                    modality === "domicilio" ? "border-brand bg-brand-soft shadow-card" : "border-border hover:border-brand/50"
                  )}
                >
                  <Home className="h-7 w-7 text-brand mb-3" />
                  <h3 className="font-display font-semibold text-navy mb-1">A domicilio</h3>
                  <p className="text-sm text-muted-foreground">El fisio va a tu casa en Lima.</p>
                </button>
              )}
              {physio.modalities.includes("videollamada") && (
                <button
                  onClick={() => setModality("videollamada")}
                  className={cn(
                    "p-6 rounded-xl border-2 text-left transition-smooth",
                    modality === "videollamada" ? "border-brand bg-brand-soft shadow-card" : "border-border hover:border-brand/50"
                  )}
                >
                  <Video className="h-7 w-7 text-brand mb-3" />
                  <h3 className="font-display font-semibold text-navy mb-1">Videollamada</h3>
                  <p className="text-sm text-muted-foreground">Sesión online desde donde estés.</p>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-xl font-bold text-navy mb-1">Elige fecha y hora</h2>
            <p className="text-sm text-muted-foreground mb-6">Disponibilidad de los próximos días</p>

            <div className="space-y-5">
              <div>
                <Label className="text-sm font-semibold mb-3 block">Fecha</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {physio.availability.map(d => {
                    const dt = new Date(d.date);
                    return (
                      <button
                        key={d.date}
                        onClick={() => { setDate(d.date); setTime(""); }}
                        className={cn(
                          "p-3 rounded-lg border-2 text-center transition-smooth",
                          date === d.date ? "border-brand bg-brand text-brand-foreground" : "border-border hover:border-brand/50"
                        )}
                      >
                        <div className="text-xs uppercase">{dt.toLocaleDateString('es', { weekday: 'short' })}</div>
                        <div className="font-display font-bold text-lg">{dt.getDate()}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {date && (
                <div className="animate-fade-in">
                  <Label className="text-sm font-semibold mb-3 block">Hora disponible</Label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {physio.availability.find(d => d.date === date)?.slots.map(s => (
                      <button
                        key={s}
                        onClick={() => setTime(s)}
                        className={cn(
                          "p-3 rounded-lg border-2 text-sm font-medium transition-smooth",
                          time === s ? "border-brand bg-brand text-brand-foreground" : "border-border hover:border-brand/50"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-xl font-bold text-navy mb-1">Resumen</h2>
            <p className="text-sm text-muted-foreground mb-6">Revisa los detalles antes de pagar</p>

            <div className="space-y-3 bg-muted/40 rounded-lg p-5">
              <Row label="Profesional" value={physio.name} />
              <Row label="Modalidad" value={modality === "domicilio" ? "A domicilio" : "Videollamada"} />
              <Row label="Fecha" value={new Date(date).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })} />
              <Row label="Hora" value={time} />
              <Row label="Duración" value="50 minutos" />
              <div className="pt-3 mt-3 border-t flex justify-between items-center">
                <span className="font-display font-semibold">Total</span>
                <span className="font-display text-2xl font-bold text-navy">S/ {physio.pricePerSession}</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-health-soft rounded-lg flex gap-3 items-start">
              <ShieldCheck className="h-5 w-5 text-health shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-foreground/80">
                  Cancelación gratuita hasta 12 horas antes. Reembolso completo si tu fisio no se presenta.
                </p>
                <CancellationPolicyDialog
                  trigger={
                    <button type="button" className="mt-1.5 text-xs font-semibold text-health hover:underline inline-flex items-center gap-1">
                      <Info className="h-3 w-3" /> Ver política completa de cancelaciones
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-xl font-bold text-navy mb-1">Método de pago</h2>
            <p className="text-sm text-muted-foreground mb-6">Total a pagar: <span className="font-bold text-navy">S/ {physio.pricePerSession}</span></p>

            <div className="grid md:grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setPayment("yape")}
                className={cn(
                  "p-5 rounded-xl border-2 text-left transition-smooth flex items-center gap-3",
                  payment === "yape" ? "border-brand bg-brand-soft" : "border-border hover:border-brand/50"
                )}
              >
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <div className="font-semibold">Yape</div>
                  <div className="text-xs text-muted-foreground">Pago instantáneo</div>
                </div>
              </button>
              <button
                onClick={() => setPayment("card")}
                className={cn(
                  "p-5 rounded-xl border-2 text-left transition-smooth flex items-center gap-3",
                  payment === "card" ? "border-brand bg-brand-soft" : "border-border hover:border-brand/50"
                )}
              >
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <div className="font-semibold">Tarjeta</div>
                  <div className="text-xs text-muted-foreground">Visa, Mastercard</div>
                </div>
              </button>
            </div>

            {payment === "card" && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <Label>Número de tarjeta</Label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Vencimiento</Label><Input placeholder="MM/AA" /></div>
                  <div><Label>CVV</Label><Input placeholder="123" /></div>
                </div>
              </div>
            )}

            {payment === "yape" && (
              <div className="bg-muted/40 rounded-lg p-5 text-center animate-fade-in">
                <Smartphone className="h-10 w-10 mx-auto text-brand mb-3" />
                <p className="text-sm font-medium">Yapea al número <span className="text-brand">+51 999 888 777</span></p>
                <p className="text-xs text-muted-foreground mt-1">Confirmación automática en segundos</p>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="animate-scale-in text-center py-8">
            <div className="h-20 w-20 mx-auto rounded-full bg-health text-health-foreground flex items-center justify-center mb-5 shadow-glow">
              <Check className="h-10 w-10" strokeWidth={3} />
            </div>
            <h2 className="font-display text-3xl font-bold text-navy mb-2">¡Sesión confirmada!</h2>
            <p className="text-muted-foreground mb-6">Te enviamos los detalles a tu correo</p>

            <div className="max-w-sm mx-auto bg-muted/40 rounded-lg p-5 text-left space-y-2">
              <Row label="Profesional" value={physio.name} />
              <Row label="Fecha" value={new Date(date).toLocaleDateString('es', { day: 'numeric', month: 'long' })} />
              <Row label="Hora" value={time} />
              <Row label="Modalidad" value={modality === "domicilio" ? "Domicilio" : "Videollamada"} />
            </div>

            <div className="max-w-sm mx-auto mt-5 p-4 rounded-lg bg-brand-soft/60 border border-brand/20 text-left">
              <div className="flex items-start gap-2.5">
                <div className="flex gap-1 shrink-0">
                  <MessageCircle className="h-4 w-4 text-brand" />
                  <Mail className="h-4 w-4 text-brand" />
                </div>
                <p className="text-xs text-foreground/85 leading-relaxed">
                  <strong>Recibirás un recordatorio por WhatsApp y correo 24 horas antes</strong> de tu sesión, con el enlace o dirección y los datos de contacto.
                </p>
              </div>
            </div>

            <div className="max-w-sm mx-auto mt-3">
              <CancellationPolicyDialog
                trigger={
                  <button type="button" className="text-xs text-muted-foreground hover:text-brand underline">
                    Revisar política de cancelaciones
                  </button>
                }
              />
            </div>

            <div className="flex gap-3 justify-center mt-8">
              <Button variant="outline" asChild><Link to="/buscar">Buscar más</Link></Button>
              <Button variant="hero" asChild><Link to="/dashboard"><Calendar /> Ir a mi panel</Link></Button>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        {step < 5 && (
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button variant="ghost" onClick={step === 1 ? () => navigate(-1) : back}>
              <ArrowLeft /> Atrás
            </Button>
            {step < 4 ? (
              <Button variant="hero" onClick={next} disabled={!canNext}>
                Continuar <ArrowRight />
              </Button>
            ) : (
              <Button variant="health" onClick={handlePay} disabled={!canNext}>
                Confirmar pago <Check />
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default Booking;
