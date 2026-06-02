import { Link, NavLink, useNavigate } from "react-router-dom";
import { Activity, Menu, X, MessageCircle, LogOut, User, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { RECENT_CHATS } from "@/data/mockData";
// Importamos el cliente real de Supabase
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/buscar", label: "Especialistas" },
  { to: "/faq", label: "FAQ" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const unread = RECENT_CHATS.reduce((s, c) => s + c.unread, 0);

  // Función corregida: Ahora sí cierra la sesión en el servidor
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Sesión cerrada correctamente");
      navigate("/");
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error.message);
      toast.error("Hubo un problema al cerrar la sesión");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero shadow-card group-hover:shadow-glow transition-smooth">
            <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold text-navy">FisioCare</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-smooth",
                  isActive ? "text-brand bg-brand-soft" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/registro-fisio"
            className="ml-1 px-4 py-2 text-sm font-semibold rounded-md bg-health/10 text-health hover:bg-health hover:text-white transition-smooth flex items-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-health animate-pulse" />
            ¿Eres fisio? Únete
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          {/* Messages icon — always visible */}
          <Link
            to="/dashboard/mensajes"
            aria-label="Mensajes"
            className="relative p-2 rounded-md hover:bg-muted transition-smooth"
          >
            <MessageCircle className="h-5 w-5 text-foreground/70" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
            )}
          </Link>

          {/* Auth buttons — always visible on every breakpoint */}
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
          <Button variant="hero" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/registro">Registrarse</Link>
          </Button>

          {/* Mobile compact auth */}
          <Button variant="ghost" size="sm" asChild className="sm:hidden px-2 text-xs">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button variant="hero" size="sm" asChild className="sm:hidden px-2.5 text-xs">
            <Link to="/registro">Registro</Link>
          </Button>

          {/* Profile dropdown with logout */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-9 w-9 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center shadow-card hover:shadow-glow transition-smooth ml-1">
              <User className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer">
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Panel paciente
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard-fisio" className="cursor-pointer">
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Panel fisio
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/mensajes" className="cursor-pointer">
                  <MessageCircle className="h-4 w-4 mr-2" /> Mensajes
                  {unread > 0 && <span className="ml-auto h-2 w-2 rounded-full bg-destructive" />}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Aquí se llama a la función conectada a Supabase */}
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 text-sm font-medium rounded-md",
                    isActive ? "text-brand bg-brand-soft" : "text-foreground/80"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/registro-fisio"
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm font-semibold rounded-md bg-health/10 text-health flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-health animate-pulse" />
              ¿Eres fisio? Únete
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
