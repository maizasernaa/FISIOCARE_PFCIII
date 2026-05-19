import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/data/faq";

const FAQ = () => (
  <div className="container py-12 max-w-3xl">
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-soft text-brand mb-4">
        <HelpCircle className="h-7 w-7" />
      </div>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-navy">Preguntas frecuentes</h1>
      <p className="text-muted-foreground mt-2">Resolvemos las dudas más comunes sobre FisioCare.</p>
    </div>

    <Accordion type="single" collapsible className="space-y-3">
      {FAQ_ITEMS.map((f, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="border rounded-xl px-5 bg-card shadow-card"
        >
          <AccordionTrigger className="text-left font-semibold text-navy hover:no-underline">
            {f.q}
          </AccordionTrigger>
          <AccordionContent className="text-foreground/80 leading-relaxed">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default FAQ;
