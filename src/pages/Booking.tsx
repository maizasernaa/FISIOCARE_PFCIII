import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Home, Video, Check, CreditCard, Smartphone, ShieldCheck, ArrowLeft, ArrowRight,
  Calendar, MessageCircle, Mail, Info, Loader2, Lock, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CancellationPolicyDialog } from "@/components/CancellationPolicyDialog";
import { supabase } from "@/integrations/supabase/client";
import { fetchFisioById, type FisioListItem, type Tarifa } from "@/lib/api/fisios";

type Step = 1 | 2 | 3 | 4 | 5;

const todayISO = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
};
const DEFAULT_DATES = Array.from({ length: 6 }, (_, i) => todayISO(i));
const DEFAULT_SLOTS = ["09:00", "11:00", "15:00", "17:00"];

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fisio, setFisio] = useState<FisioListItem | null>(null);
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [loadingFisio, setLoadingFisio] = useState(true);

  const [step, setStep] = useState<Step>(1);
  const [modality, setModality] = useState<string | null>(null);
  const [especialidadId, setEspecialidadId] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [payment, setPayment] = useState<"Yape" | "Tarjeta" | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    setLoadingFisio(true);
    fetchFisioById(id)
      .then((res) => {
        if (res) {
          setFisio(res.fisio);
          setTarifas(res.tarifas);
        }
      })
      .finally(() => setLoadingFisio(false));
  }, [id]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.user_metadata?.full_name) setNombre(session.user.user_metadata.full_name);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loadingFisio) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }

  if (!fisio) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Fisioterapeuta no encontrado</h1>
        <Button asChild><Link to="/buscar">Volver a buscar</Link></Button>
      </div>
    );
  }

  // ---- cálculo de tarifa ----
  const computePrice = (): number => {
    if (!modality) return fisio.precio_min;
    // buscar exacta: misma modalidad + misma especialidad
    const exact = tarifas.find((t) => t.modalidad === modality && t.especialidad_id === especialidadId);
    if (exact) return exact.precio;
    // misma modalidad sin especialidad
    const byMod = tarifas.find((t) => t.modalidad === modality && !t.especialidad_id);
    if (byMod) return byMod.precio;
    // primera de la modalidad
    const anyMod = tarifas.find((t) => t.modalidad === modality);
    if (anyMod) return anyMod.precio;
    return fisio.precio_min;
  };
  const price = computePrice();

  const steps = ["Modalidad", "Fecha y hora", "Resumen", "Pago", "Confirmación"];

  const next = async () => {
    if (step === 3) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Debes iniciar sesión para reservar una cita");
        navigate(`/auth?redirect=${encodeURIComponent(`/reservar/${id}`)}`);
        return;
      }
    }
    setStep((s) => Math.min(5, s + 1) as Step);
  };
  const back = () => setStep((s) => Math.max(1, s - 1) as Step);

  const canNext =
    (step === 1 && modality && (modality !== "domicilio" || distrito)) ||
    (step === 2 && date && time) ||
    (step === 3 && nombre.trim().length >= 2 && telefono.trim().length >= 6) ||
    (step === 4 && payment);

  const handlePay = async () => {
    setSaving(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        toast.error("Sesión expirada. Inicia sesión de nuevo.");
        navigate(`/auth?redirect=${encodeURIComponent(`/reservar/${id}`)}`);
        return;
      }
      // asegurar perfil del paciente (por si el trigger fue salteado)
      await supabase
        .from("perfiles")
        .upsert({ id: sess.session.user.id, nombre_completo: nombre.trim(), telefono: telefono.trim(), rol: "paciente" });

      const { data: cita, error: citaErr } = await supabase
        .from("citas")
        .insert({
          paciente_id: sess.session.user.id,
          fisioterapeuta_id: fisio.id,
          fecha_cita: date,
          hora_cita: time,
          modalidad: modality!,
          distrito_cruce: modality === "domicilio" ? distrito : null,
          direccion_exacta: modality === "domicilio" ? direccion : null,
          especialidad_id: especialidadId || null,
          estado: "confirmada",
        })
        .select()
        .single();
      if (citaErr) throw citaErr;

      const { error: pagoErr } = await supabase.from("pagos").insert({
        cita_id: cita.id,
        monto: price,
        metodo_pago: payment!,
        estado_pago: "completado",
      });
      if (pagoErr) throw pagoErr;

      toast.success("¡Pago confirmado y cita reservada!");
      setStep(5);
    } catch (err: any) {
      toast.error(err?.message || "No se pudo guardar la cita");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <Link to="/buscar" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Volver a resultados
      </Link>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((label, i) => {
            const num = (i + 1) as Step;
            const done = step > num, active = step === num;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-smooth",
                  done ? "bg-health text-health-foreground" : active ? "bg-brand text-brand-foreground shadow-card" : "bg-muted text-muted-foreground"
                )}>
                  {done ? <Check className="h-4 w-4" /> : num}
                </div>
                {i < steps.length - 1 && <div className={cn("flex-1 h-0.5 mx-2", step > num ? "bg-health" : "bg-muted")} />}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {steps.map((l) => <span key={l} className="flex-1 text-center first:text-left last:text-right">{l}</span>)}
        </div>
      </div>

      <Card className="p-6 md:p-8 shadow-elevated min-h-[400px]">
        {/* Encabezado */}
        <div className="flex items-center gap-3 pb-5 mb-6 border-b">
          <img
            src={fisio.foto_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fisio.nombre)}`}
            alt={fisio.nombre}
            className="w-12 h-12 rounded-lg object-cover bg-muted"
          />
          <div className="flex-1">
            <div className="font-display font-semibold text-navy">{fisio.nombre}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              {fisio.especialidades.map((e) => e.nombre).join(" • ") || "Fisioterapeuta"}
              {fisio.calificacion > 0 && (
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-warning text-warning" /> {fisio.calificacion.toFixed(1)}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-display font-bold text-navy">S/ {price}</div>
            <div className="text-xs text-muted-foreground">/ sesión</div>
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-xl font-bold text-navy mb-1">Elige la modalidad</h2>
            <p className="text-sm text-muted-foreground mb-6">¿Cómo prefieres tu sesión?</p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {fisio.modalidades.includes("domicilio") && (
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
              {fisio.modalidades.includes("videollamada") && (
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

            {fisio.especialidades.length > 0 && (
              <div className="mb-4">
                <Label className="text-sm font-semibold mb-2 block">Especialidad de la consulta (opcional)</Label>
                <Select value={especialidadId || "none"} onValueChange={(v) => setEspecialidadId(v === "none" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="Sin especificar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin especificar</SelectItem>
                    {fisio.especialidades.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {modality === "domicilio" && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Distrito</Label>
                  <Select value={distrito} onValueChange={setDistrito}>
                    <SelectTrigger><SelectValue placeholder="Selecciona distrito" /></SelectTrigger>
                    <SelectContent>
                      {fisio.distritos_cobertura.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Dirección exacta</Label>
                  <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Av. Principal 123, Dpto 4B" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-xl font-bold text-navy mb-1">Elige fecha y hora</h2>
            <p className="text-sm text-muted-foreground mb-6">Disponibilidad de los próximos días</p>

            <div className="space-y-5">
              <div>
                <Label className="text-sm font-semibold mb-3 block">Fecha</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {DEFAULT_DATES.map((d) => {
                    const dt = new Date(d);
                    return (
                      <button
                        key={d}
                        onClick={() => { setDate(d); setTime(""); }}
                        className={cn(
                          "p-3 rounded-lg border-2 text-center transition-smooth",
                          date === d ? "border-brand bg-brand text-brand-foreground" : "border-border hover:border-brand/50"
                        )}
                      >
                        <div className="text-xs uppercase">{dt.toLocaleDateString("es", { weekday: "short" })}</div>
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
                    {DEFAULT_SLOTS.map((s) => (
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

        {/* Step 3 */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-xl font-bold text-navy mb-1">Resumen</h2>
            <p className="text-sm text-muted-foreground mb-6">Revisa los detalles antes de pagar</p>

            <div className="space-y-3 bg-muted/40 rounded-lg p-5">
              <Row label="Profesional" value={fisio.nombre} />
              <Row label="Modalidad" value={modality === "domicilio" ? "A domicilio" : "Videollamada"} />
              {modality === "domicilio" && distrito && <Row label="Distrito" value={distrito} />}
              <Row label="Fecha" value={new Date(date).toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })} />
              <Row label="Hora" value={time} />
              <Row label="Duración" value="50 minutos" />
              <div className="pt-3 mt-3 border-t flex justify-between items-center">
                <span className="font-display font-semibold">Total</span>
                <span className="font-display text-2xl font-bold text-navy">S/ {price}</span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <h3 className="font-display font-semibold text-navy text-sm">Tus datos de contacto</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="María Gonzales" required />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+51 999 888 777" required />
                </div>
              </div>
            </div>

            {!user && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 items-start">
                <Lock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">Inicia sesión para continuar</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Solo los usuarios registrados pueden reservar citas.{" "}
                    <button
                      type="button"
                      onClick={() => navigate(`/auth?redirect=${encodeURIComponent(`/reservar/${id}`)}`)}
                      className="font-semibold underline hover:text-amber-900"
                    >
                      Iniciar sesión o registrarse
                    </button>
                  </p>
                </div>
              </div>
            )}

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

        {/* Step 4 */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-xl font-bold text-navy mb-1">Método de pago</h2>
            <p className="text-sm text-muted-foreground mb-6">Total a pagar: <span className="font-bold text-navy">S/ {price}</span></p>

            <div className="grid md:grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setPayment("Yape")}
                className={cn(
                  "p-5 rounded-xl border-2 text-left transition-smooth flex items-center gap-3",
                  payment === "Yape" ? "border-brand bg-brand-soft" : "border-border hover:border-brand/50"
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
                onClick={() => setPayment("Tarjeta")}
                className={cn(
                  "p-5 rounded-xl border-2 text-left transition-smooth flex items-center gap-3",
                  payment === "Tarjeta" ? "border-brand bg-brand-soft" : "border-border hover:border-brand/50"
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

            {payment === "Tarjeta" && (
              <div className="space-y-3 animate-fade-in">
                <div><Label>Número de tarjeta</Label><Input placeholder="1234 5678 9012 3456" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Vencimiento</Label><Input placeholder="MM/AA" /></div>
                  <div><Label>CVV</Label><Input placeholder="123" /></div>
                </div>
              </div>
            )}

            {payment === "Yape" && (
              <div className="bg-muted/40 rounded-lg p-5 text-center animate-fade-in">
                <Smartphone className="h-10 w-10 mx-auto text-brand mb-3" />
                <p className="text-sm font-medium">Yapea al número <span className="text-brand">+51 999 888 777</span></p>
                <p className="text-xs text-muted-foreground mt-1">Confirmación automática en segundos</p>
              </div>
            )}
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="animate-scale-in text-center py-8">
            <div className="h-20 w-20 mx-auto rounded-full bg-health text-health-foreground flex items-center justify-center mb-5 shadow-glow">
              <Check className="h-10 w-10" strokeWidth={3} />
            </div>
            <h2 className="font-display text-3xl font-bold text-navy mb-2">¡Sesión confirmada!</h2>
            <p className="text-muted-foreground mb-6">Te enviamos los detalles a tu correo</p>

            <div className="max-w-sm mx-auto bg-muted/40 rounded-lg p-5 text-left space-y-2">
              <Row label="Profesional" value={fisio.nombre} />
              <Row label="Fecha" value={new Date(date).toLocaleDateString("es", { day: "numeric", month: "long" })} />
              <Row label="Hora" value={time} />
              <Row label="Modalidad" value={modality === "domicilio" ? "Domicilio" : "Videollamada"} />
              <Row label="Total pagado" value={`S/ ${price}`} />
            </div>

            <div className="max-w-sm mx-auto mt-5 p-4 rounded-lg bg-brand-soft/60 border border-brand/20 text-left">
              <div className="flex items-start gap-2.5">
                <div className="flex gap-1 shrink-0">
                  <MessageCircle className="h-4 w-4 text-brand" />
                  <Mail className="h-4 w-4 text-brand" />
                </div>
                <p className="text-xs text-foreground/85 leading-relaxed">
                  <strong>Recibirás un recordatorio por WhatsApp y correo 24 horas antes</strong> de tu sesión.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center mt-8">
              <Button variant="outline" asChild><Link to="/buscar">Buscar más</Link></Button>
              <Button variant="hero" asChild><Link to="/dashboard"><Calendar /> Ir a mi panel</Link></Button>
            </div>
          </div>
        )}

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
              <Button variant="health" onClick={handlePay} disabled={!canNext || saving}>
                {saving ? <><Loader2 className="animate-spin" /> Procesando</> : <>Confirmar pago <Check /></>}
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
