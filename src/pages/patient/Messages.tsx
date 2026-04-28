import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PHYSIOS } from "@/data/mockData";

interface Msg { id: string; from: "me" | "them"; text: string; time: string; }

const initialChats: Record<string, Msg[]> = {
  p1: [
    { id: "1", from: "them", text: "¡Hola María! ¿Cómo te has sentido después de la última sesión?", time: "10:24" },
    { id: "2", from: "me", text: "Mucho mejor, el dolor bajó bastante 🙌", time: "10:30" },
    { id: "3", from: "them", text: "Excelente. Recuerda hacer los estiramientos 3 veces al día.", time: "10:31" },
  ],
  p3: [
    { id: "1", from: "them", text: "Te envié la rutina actualizada. Cualquier duda, me avisas.", time: "Ayer" },
  ],
};

const Messages = () => {
  const physios = PHYSIOS.filter(p => ["p1", "p3"].includes(p.id));
  const [activeId, setActiveId] = useState("p1");
  const [chats, setChats] = useState(initialChats);
  const [input, setInput] = useState("");
  const active = physios.find(p => p.id === activeId)!;

  const send = () => {
    if (!input.trim()) return;
    const newMsg: Msg = { id: Date.now().toString(), from: "me", text: input, time: "Ahora" };
    setChats(c => ({ ...c, [activeId]: [...(c[activeId] || []), newMsg] }));
    setInput("");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container py-8 max-w-5xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand mb-4">
          <ArrowLeft className="h-4 w-4" /> Volver al dashboard
        </Link>
        <h1 className="font-display text-3xl font-bold text-navy mb-6">Mensajes</h1>

        <Card className="grid md:grid-cols-[280px_1fr] overflow-hidden h-[600px]">
          <div className="border-r bg-muted/30 flex flex-col">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-8 h-9" />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {physios.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActiveId(p.id)}
                  className={`w-full text-left p-3 flex gap-3 items-center border-b transition-smooth ${activeId === p.id ? "bg-brand-soft" : "hover:bg-muted"}`}
                >
                  <img src={p.photo} alt={p.name} className="h-10 w-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-navy truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{chats[p.id]?.slice(-1)[0]?.text}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="p-4 border-b flex items-center gap-3">
              <img src={active.photo} alt={active.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <div className="font-semibold text-navy">{active.name}</div>
                <div className="text-xs text-health">● En línea</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
              {(chats[activeId] || []).map(m => (
                <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.from === "me" ? "bg-brand text-brand-foreground" : "bg-background border"}`}>
                    <p>{m.text}</p>
                    <div className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/70" : "text-muted-foreground"}`}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Escribe un mensaje..."
              />
              <Button variant="hero" size="icon" onClick={send}><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
