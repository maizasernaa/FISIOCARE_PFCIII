import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Activity, Upload, Check, ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { LIMA_DISTRICTS } from "@/data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { fetchEspecialidades, type Especialidad } from "@/lib/api/fisios";

const PhysioRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Step 2
  const [especialidadesDb, setEspecialidadesDb] = useState<Especialidad[]>([]);
  const [selectedEspecialidades, setSelectedEspecialidades] = useState<string[]>([]); // ids
  const [colegiatura, setColegiatura] = useState("");
  const [anos, setAnos] = useState("0");
  const [bio, setBio] = useState("");

  // Step 3
  const [modalidades, setModalidades] = useState<string[]>(["domicilio"]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [tarifas, setTarifas] = useState<Record<string, string>>({}); // modalidad -> precio

  // Step 4
  const [docDiploma, setDocDiploma] = useState(false);
  const [docColegiatura, setDocColegiatura] = useState(false);
  const [docDni, setDocDni] = useState(false);

  useEffect(() => {
    fetchEspecialidades().then(setEspecialidadesDb).catch(() => {});
  }, []);

  const toggleArr = (arr: string[], setter: (v: string[]) => void, item: string) =>
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);

  const toggleModalidad = (m: string) => {
    setModalidades((prev) => {
      const next = prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m];
      // limpiar tarifas si se removió
      setTarifas((t) => {
        const c = { ...t };
        if (!next.includes(m)) delete c[m];
        return c;
      });
      return next;
    });
  };

  // ----- STEP 1: registrar en auth.users (trigger crea perfil con rol='fisioterapeuta') -----
  const submitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres.trim() || !apellidos.trim()) return toast.error("Completa nombres y apellidos");
    setLoading(true);
    try {
      const fullName = `${nombres.trim()} ${apellidos.trim()}`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            nombre_completo: fullName,
            telefono,
            rol: "fisioterapeuta",
          },
        },
      });
      if (error) throw error;
      const uid = data.user?.id ?? data.session?.user?.id;
      if (!uid) throw new Error("No se pudo crear la cuenta");
      setUserId(uid);
      // Si la confirmación por email está activada, no hay sesión; igual seguimos el flujo
      // pero los siguientes pasos requieren sesión para satisfacer RLS. Si no hay sesión,
      // intentamos iniciarla automáticamente.
      if (!data.session) {
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) {
          toast.error("Confirma tu correo y vuelve a iniciar sesión para continuar.");
          setLoading(false);
          return;
        }
      }
      // Asegurar/actualizar perfil (idempotente, por si el trigger falló o falta data)
      await supabase
        .from("perfiles")
        .upsert({ id: uid, nombre_completo: fullName, telefono, rol: "fisioterapeuta" });
      toast.success("Cuenta creada. Continuemos con tu perfil profesional.");
      setStep(2);
    } catch (err: any) {
      toast.error(err?.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  // ----- STEP 2: insertar fisioterapeuta + especialidades -----
  const submitStep2 = async () => {
    if (!userId) return toast.error("Sesión no encontrada");
    if (selectedEspecialidades.length === 0) return toast.error("Selecciona al menos una especialidad");
    if (!colegiatura.trim()) return toast.error("Ingresa tu N° de colegiatura");
    setLoading(true);
    try {
      const { error: fisioErr } = await supabase
        .from("fisioterapeutas")
        .upsert({
          id: userId,
          colegiatura: colegiatura.trim(),
          anos_experiencia: Number(anos) || 0,
          bio,
          documentos_validados: false,
        });
      if (fisioErr) throw fisioErr;

      // limpiar y reinsertar especialidades
      await supabase.from("fisioterapeuta_especialidades").delete().eq("fisioterapeuta_id", userId);
      const rows = selectedEspecialidades.map((eid) => ({ fisioterapeuta_id: userId, especialidad_id: eid }));
      const { error: feErr } = await supabase.from("fisioterapeuta_especialidades").insert(rows);
      if (feErr) throw feErr;

      setStep(3);
    } catch (err: any) {
      toast.error(err?.message || "Error guardando datos profesionales");
    } finally {
      setLoading(false);
    }
  };

  // ----- STEP 3: tarifas + distritos -----
  const submitStep3 = async () => {
    if (!userId) return toast.error("Sesión no encontrada");
    if (modalidades.length === 0) return toast.error("Selecciona al menos una modalidad");
    if (districts.length === 0) return toast.error("Selecciona al menos un distrito");
    for (const m of modalidades) {
      if (!tarifas[m] || Number(tarifas[m]) <= 0) return toast.error(`Ingresa el precio para ${m}`);
    }
    setLoading(true);
    try {
      // actualizar modalidades/distritos
      const { error: updErr } = await supabase
        .from("fisioterapeutas")
        .update({ modalidades, distritos_cobertura: districts })
        .eq("id", userId);
      if (updErr) throw updErr;

      // reemplazar tarifas
      await supabase.from("fisioterapeuta_tarifas").delete().eq("fisioterapeuta_id", userId);
      const tarifaRows = modalidades.map((m) => ({
        fisioterapeuta_id: userId,
        modalidad: m,
        precio: Number(tarifas[m]),
      }));
      const { error: tErr } = await supabase.from("fisioterapeuta_tarifas").insert(tarifaRows);
      if (tErr) throw tErr;

      setStep(4);
    } catch (err: any) {
      toast.error(err?.message || "Error guardando tarifas");
    } finally {
      setLoading(false);
    }
  };

  // ----- STEP 4: documentos (validación bloqueante) -----
  const docsCompletos = docDiploma && docColegiatura && docDni;

  const submitStep4 = async () => {
    if (!userId) return toast.error("Sesión no encontrada");
    if (!docsCompletos) {
      toast.error("Debes subir Diploma, Colegiatura y DNI antes de enviar");
      return;
    }
    setLoading(true);
    try {
      // simular URLs
      const fakeUrl = (label: string) =>
        `https://fisiocare.local/docs/${userId}/${label}-${Date.now()}.pdf`;
      const { error } = await supabase
        .from("fisioterapeutas")
        .update({
          url_diploma: fakeUrl("diploma"),
          url_colegiatura: fakeUrl("colegiatura"),
          url_dni: fakeUrl("dni"),
        })
        .eq("id", userId);
      if (error) throw error;
      toast.success("Perfil enviado. Verificaremos tu colegiatura en 24-48h.");
      setTimeout(() => navigate("/"), 1200);
    } catch (err: any) {
      toast.error(err?.message || "Error enviando documentos");
    } finally {
      setLoading(false);
    }
  };

  const stepsLabels = ["Datos", "Profesional", "Atención", "Documentos"];

  return (
    <div className="min-h-screen bg-gradient-soft py-8">
      <div className="container max-w-3xl">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero shadow-card">
            <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl font-bold text-navy">FisioCare</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy">Únete como profesional</h1>
          <p className="text-muted-foreground mt-2">Completa tu perfil para empezar a recibir pacientes</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-6">
          {stepsLabels.map((label, i) => {
            const num = i + 1;
            const done = step > num,
              active = step === num;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                    done
                      ? "bg-health text-health-foreground"
                      : active
                      ? "bg-brand text-brand-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : num}
                </div>
                <span className={cn("ml-2 text-xs font-medium hidden sm:block", active ? "text-navy" : "text-muted-foreground")}>
                  {label}
                </span>
                {i < stepsLabels.length - 1 && (
                  <div className={cn("flex-1 h-0.5 mx-3", done ? "bg-health" : "bg-muted")} />
                )}
              </div>
            );
          })}
        </div>

        <Card className="p-6 md:p-8 shadow-elevated">
          {step === 1 && (
            <form onSubmit={submitStep1} className="space-y-4 animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-navy">Datos personales</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombres</Label>
                  <Input value={nombres} onChange={(e) => setNombres(e.target.value)} placeholder="Lucía" required />
                </div>
                <div className="space-y-2">
                  <Label>Apellidos</Label>
                  <Input value={apellidos} onChange={(e) => setApellidos(e.target.value)} placeholder="Mendoza Soto" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Correo</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="lucia@correo.com" required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Celular</Label>
                  <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+51 999 888 777" required />
                </div>
                <div className="space-y-2">
                  <Label>Contraseña</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                  <ArrowLeft /> Atrás
                </Button>
                <Button type="submit" variant="hero" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />} Continuar <ArrowRight />
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-navy">Información profesional</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>N° de colegiatura (CFTP)</Label>
                  <Input value={colegiatura} onChange={(e) => setColegiatura(e.target.value)} placeholder="CFTP-12345" required />
                </div>
                <div className="space-y-2">
                  <Label>Años de experiencia</Label>
                  <Input type="number" min="0" value={anos} onChange={(e) => setAnos(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Especialidades</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {especialidadesDb.map((s) => (
                    <label
                      key={s.id}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-md border cursor-pointer text-sm transition-smooth",
                        selectedEspecialidades.includes(s.id) ? "border-brand bg-brand-soft" : "hover:border-brand/50"
                      )}
                    >
                      <Checkbox
                        checked={selectedEspecialidades.includes(s.id)}
                        onCheckedChange={() => toggleArr(selectedEspecialidades, setSelectedEspecialidades, s.id)}
                      />
                      {s.nombre}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sobre ti</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Cuéntales a tus pacientes sobre tu enfoque..." rows={4} />
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft /> Atrás
                </Button>
                <Button type="button" variant="hero" onClick={submitStep2} disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />} Continuar <ArrowRight />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-navy">Modalidad, zonas y tarifas</h2>
              <div className="space-y-2">
                <Label>Modalidades que ofreces</Label>
                <div className="grid md:grid-cols-2 gap-2">
                  {["domicilio", "videollamada"].map((m) => (
                    <label key={m} className="flex items-center gap-2 p-3 rounded-md border cursor-pointer capitalize">
                      <Checkbox checked={modalidades.includes(m)} onCheckedChange={() => toggleModalidad(m)} />
                      {m === "domicilio" ? "A domicilio" : "Videollamada"}
                    </label>
                  ))}
                </div>
              </div>

              {modalidades.length > 0 && (
                <div className="space-y-2">
                  <Label>Precio por sesión por modalidad (S/)</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {modalidades.map((m) => (
                      <div key={m} className="space-y-1">
                        <div className="text-xs text-muted-foreground capitalize">{m}</div>
                        <Input
                          type="number"
                          min="0"
                          value={tarifas[m] ?? ""}
                          onChange={(e) => setTarifas((t) => ({ ...t, [m]: e.target.value }))}
                          placeholder="100"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Distritos de Lima donde atiendes</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                  {LIMA_DISTRICTS.map((d) => (
                    <label
                      key={d}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md border cursor-pointer text-sm transition-smooth",
                        districts.includes(d) ? "border-brand bg-brand-soft" : "hover:border-brand/50"
                      )}
                    >
                      <Checkbox checked={districts.includes(d)} onCheckedChange={() => toggleArr(districts, setDistricts, d)} />
                      {d}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                  <ArrowLeft /> Atrás
                </Button>
                <Button type="button" variant="hero" onClick={submitStep3} disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />} Continuar <ArrowRight />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-navy">Documentos de verificación</h2>
              <p className="text-sm text-muted-foreground">Necesarios para validar tu perfil. Tus documentos son privados y seguros.</p>

              {[
                { label: "Diploma de fisioterapia", checked: docDiploma, setter: setDocDiploma, req: true },
                { label: "Certificado de colegiatura vigente", checked: docColegiatura, setter: setDocColegiatura, req: true },
                { label: "DNI (anverso y reverso)", checked: docDni, setter: setDocDni, req: true },
              ].map((doc) => (
                <div
                  key={doc.label}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-5 transition-smooth",
                    doc.checked ? "border-health bg-health-soft/40" : "hover:border-brand"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {doc.checked ? <Check className="h-6 w-6 text-health" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {doc.label} {doc.req && <span className="text-destructive">*</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">PDF o imagen, máx. 5MB</div>
                    </div>
                    <Button type="button" variant={doc.checked ? "outline" : "outline"} size="sm" onClick={() => doc.setter(!doc.checked)}>
                      {doc.checked ? "Cambiar" : "Subir"}
                    </Button>
                  </div>
                </div>
              ))}

              {!docsCompletos && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Debes subir los 3 documentos requeridos para enviar tu perfil a verificación.</span>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="ghost" onClick={() => setStep(3)}>
                  <ArrowLeft /> Atrás
                </Button>
                <Button type="button" variant="health" onClick={submitStep4} disabled={loading || !docsCompletos}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />} Enviar para verificación <Check />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PhysioRegister;
