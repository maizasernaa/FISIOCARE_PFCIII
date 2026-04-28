import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Activity, Upload, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { LIMA_DISTRICTS, SPECIALTIES } from "@/data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PhysioRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const toggleArr = (arr: string[], setter: (v: string[]) => void, item: string) =>
    setter(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Perfil enviado. Verificaremos tu colegiatura en 24-48h.");
    setTimeout(() => navigate("/dashboard-fisio"), 1200);
  };

  const steps = ["Datos", "Profesional", "Atención", "Documentos"];

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
          {steps.map((label, i) => {
            const num = i + 1;
            const done = step > num, active = step === num;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                  done ? "bg-health text-health-foreground" : active ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground")}>
                  {done ? <Check className="h-4 w-4" /> : num}
                </div>
                <span className={cn("ml-2 text-xs font-medium hidden sm:block", active ? "text-navy" : "text-muted-foreground")}>{label}</span>
                {i < steps.length - 1 && <div className={cn("flex-1 h-0.5 mx-3", done ? "bg-health" : "bg-muted")} />}
              </div>
            );
          })}
        </div>

        <Card className="p-6 md:p-8 shadow-elevated">
          <form onSubmit={submit} className="space-y-5">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display text-xl font-semibold text-navy">Datos personales</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Nombres</Label><Input placeholder="Lucía" required /></div>
                  <div className="space-y-2"><Label>Apellidos</Label><Input placeholder="Mendoza Soto" required /></div>
                </div>
                <div className="space-y-2"><Label>Correo</Label><Input type="email" placeholder="lucia@correo.com" required /></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Celular</Label><Input placeholder="+51 999 888 777" required /></div>
                  <div className="space-y-2"><Label>Contraseña</Label><Input type="password" required /></div>
                </div>
                <div className="space-y-2">
                  <Label>Foto de perfil</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-brand cursor-pointer transition-smooth">
                    <Upload className="h-7 w-7 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Sube una foto profesional</p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display text-xl font-semibold text-navy">Información profesional</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>N° de colegiatura (CFTP)</Label><Input placeholder="CFTP-12345" required /></div>
                  <div className="space-y-2"><Label>Años de experiencia</Label><Input type="number" min="0" placeholder="5" required /></div>
                </div>
                <div className="space-y-2">
                  <Label>Especialidades</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {SPECIALTIES.map(s => (
                      <label key={s} className={cn("flex items-center gap-2 p-2.5 rounded-md border cursor-pointer text-sm transition-smooth",
                        specialties.includes(s) ? "border-brand bg-brand-soft" : "hover:border-brand/50")}>
                        <Checkbox checked={specialties.includes(s)} onCheckedChange={() => toggleArr(specialties, setSpecialties, s)} />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sobre ti</Label>
                  <Textarea placeholder="Cuéntales a tus pacientes sobre tu enfoque..." rows={4} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display text-xl font-semibold text-navy">Modalidad y zonas</h2>
                <div className="space-y-2">
                  <Label>Modalidades que ofreces</Label>
                  <div className="grid md:grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-3 rounded-md border cursor-pointer">
                      <Checkbox defaultChecked /> A domicilio
                    </label>
                    <label className="flex items-center gap-2 p-3 rounded-md border cursor-pointer">
                      <Checkbox /> Videollamada
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Distritos de Lima donde atiendes</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                    {LIMA_DISTRICTS.map(d => (
                      <label key={d} className={cn("flex items-center gap-2 p-2 rounded-md border cursor-pointer text-sm transition-smooth",
                        districts.includes(d) ? "border-brand bg-brand-soft" : "hover:border-brand/50")}>
                        <Checkbox checked={districts.includes(d)} onCheckedChange={() => toggleArr(districts, setDistricts, d)} />
                        {d}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2"><Label>Precio por sesión (S/)</Label><Input type="number" min="50" placeholder="100" required /></div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display text-xl font-semibold text-navy">Documentos de verificación</h2>
                <p className="text-sm text-muted-foreground">Necesarios para validar tu perfil. Tus documentos son privados y seguros.</p>
                {[
                  { label: "Diploma de fisioterapia", req: true },
                  { label: "Certificado de colegiatura vigente", req: true },
                  { label: "DNI (anverso y reverso)", req: true },
                  { label: "Certificados de especialización (opcional)", req: false },
                ].map((doc) => (
                  <div key={doc.label} className="border-2 border-dashed rounded-lg p-5 hover:border-brand cursor-pointer transition-smooth">
                    <div className="flex items-center gap-3">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{doc.label} {doc.req && <span className="text-destructive">*</span>}</div>
                        <div className="text-xs text-muted-foreground">PDF o imagen, máx. 5MB</div>
                      </div>
                      <Button type="button" variant="outline" size="sm">Subir</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)}>
                <ArrowLeft /> Atrás
              </Button>
              {step < 4 ? (
                <Button type="button" variant="hero" onClick={() => setStep(step + 1)}>
                  Continuar <ArrowRight />
                </Button>
              ) : (
                <Button type="submit" variant="health">Enviar para verificación <Check /></Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PhysioRegister;
