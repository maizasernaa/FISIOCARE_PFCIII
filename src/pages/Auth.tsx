import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Activity, User, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";
type Role = "paciente" | "fisio";

const Auth = ({ mode }: { mode: Mode }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialRole = (params.get("role") as Role) || "paciente";
  const [role, setRole] = useState<Role>(initialRole);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(mode === "login" ? "Sesión iniciada" : "Cuenta creada exitosamente");
    if (role === "fisio") navigate("/dashboard-fisio");
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero shadow-card">
            <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl font-bold text-navy">FisioCare</span>
        </Link>

        <Card className="p-8 shadow-elevated">
          <h1 className="font-display text-2xl font-bold text-navy mb-1">
            {mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login" ? "Ingresa para continuar" : "Empieza a usar FisioCare hoy"}
          </p>

          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg mb-6">
            {([
              { v: "paciente", icon: User, label: "Paciente" },
              { v: "fisio", icon: Stethoscope, label: "Fisioterapeuta" },
            ] as const).map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => setRole(opt.v as Role)}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-smooth",
                  role === opt.v ? "bg-background text-navy shadow-card" : "text-muted-foreground"
                )}
              >
                <opt.icon className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" placeholder="María Gonzales" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@correo.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full">
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </Button>

            {role === "fisio" && mode === "register" && (
              <p className="text-xs text-center text-muted-foreground">
                Luego completarás tu perfil profesional con colegiatura y documentos.
              </p>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>¿No tienes cuenta? <Link to="/registro" className="text-brand font-medium hover:underline">Regístrate</Link></>
            ) : (
              <>¿Ya tienes cuenta? <Link to="/login" className="text-brand font-medium hover:underline">Inicia sesión</Link></>
            )}
          </div>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
