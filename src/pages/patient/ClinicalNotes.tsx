import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Calendar } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_APPOINTMENTS } from "@/data/mockData";

const ClinicalNotes = () => {
  const notes = MOCK_APPOINTMENTS.filter(a => a.notes);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container py-8 max-w-4xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand mb-4">
          <ArrowLeft className="h-4 w-4" /> Volver al dashboard
        </Link>
        <h1 className="font-display text-3xl font-bold text-navy mb-2">Notas clínicas</h1>
        <p className="text-muted-foreground mb-8">Recomendaciones y observaciones de tus fisioterapeutas.</p>

        <div className="space-y-4">
          {notes.map(apt => (
            <Card key={apt.id} className="p-6 shadow-card">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <div className="font-semibold text-navy">{apt.physioName}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(apt.date).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <Badge variant="secondary" className="bg-brand-soft text-brand border-0">{apt.modality}</Badge>
              </div>
              <div className="bg-brand-soft/40 rounded-lg p-4 flex gap-3">
                <FileText className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/90 leading-relaxed">{apt.notes}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClinicalNotes;
