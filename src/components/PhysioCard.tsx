import { Link } from "react-router-dom";
import { Star, MapPin, Video, Home, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Physio } from "@/data/mockData";

export const PhysioCard = ({ physio }: { physio: Physio }) => (
  <Card className="overflow-hidden shadow-card hover:shadow-elevated transition-smooth group">
    <div className="p-5 flex gap-4">
      <div className="relative shrink-0">
        <img
          src={physio.photo}
          alt={physio.name}
          loading="lazy"
          className="w-24 h-24 rounded-xl object-cover ring-2 ring-brand-soft"
        />
        {physio.verified && (
          <div className="absolute -bottom-1 -right-1 bg-health text-health-foreground rounded-full p-1 shadow-card">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display font-semibold text-navy truncate">{physio.name}</h3>
            <div className="flex items-center gap-1 mt-0.5 text-sm">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="font-medium">{physio.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({physio.reviewCount})</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-display font-bold text-navy">S/ {physio.pricePerSession}</div>
            <div className="text-xs text-muted-foreground">por sesión</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {physio.specialties.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs font-normal">{s}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
          {physio.modalities.includes("domicilio") && (
            <span className="flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Domicilio</span>
          )}
          {physio.modalities.includes("videollamada") && (
            <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5" /> Online</span>
          )}
          <span className="flex items-center gap-1 truncate"><MapPin className="h-3.5 w-3.5" /> {physio.districts.slice(0, 2).join(", ")}</span>
        </div>
      </div>
    </div>

    <div className="px-5 pb-5">
      <Button variant="brand" className="w-full" asChild>
        <Link to={`/fisio/${physio.id}`}>Ver perfil</Link>
      </Button>
    </div>
  </Card>
);
