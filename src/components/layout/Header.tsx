import { Link, NavLink } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/buscar", label: "Buscar fisios" },
  { to: "/como-funciona", label: "Cómo funciona" },
  { to: "/para-fisios", label: "Para fisioterapeutas" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
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
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Iniciar sesión</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/registro">Crear cuenta</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
            <div className="flex gap-2 pt-2 border-t mt-2">
              <Button variant="ghost" className="flex-1" asChild>
                <Link to="/login" onClick={() => setOpen(false)}>Iniciar sesión</Link>
              </Button>
              <Button variant="hero" className="flex-1" asChild>
                <Link to="/registro" onClick={() => setOpen(false)}>Crear cuenta</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
