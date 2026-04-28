import { Link } from "react-router-dom";
import { Activity, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => (
  <footer className="bg-navy text-navy-foreground mt-24">
    <div className="container py-14 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-1">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <Activity className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold">FisioCare</span>
        </Link>
        <p className="mt-4 text-sm text-white/70 leading-relaxed">
          Conectamos pacientes con fisioterapeutas verificados en Lima.
        </p>
      </div>

      <div>
        <h4 className="font-display font-semibold mb-4">Pacientes</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li><Link to="/buscar" className="hover:text-white transition-smooth">Buscar fisioterapeuta</Link></li>
          <li><Link to="/como-funciona" className="hover:text-white transition-smooth">Cómo funciona</Link></li>
          <li><Link to="/registro" className="hover:text-white transition-smooth">Crear cuenta</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-semibold mb-4">Profesionales</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li><Link to="/para-fisios" className="hover:text-white transition-smooth">Únete como fisio</Link></li>
          <li><Link to="/registro-fisio" className="hover:text-white transition-smooth">Registrarme</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-semibold mb-4">Contacto</h4>
        <ul className="space-y-3 text-sm text-white/70">
          <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hola@fisiocare.pe</li>
          <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +51 999 888 777</li>
          <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Lima, Perú</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="container py-5 text-xs text-white/50 flex flex-col md:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} FisioCare. Todos los derechos reservados.</span>
        <span>Hecho con ♥ en Lima</span>
      </div>
    </div>
  </footer>
);
