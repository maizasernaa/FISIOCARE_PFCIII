export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "¿Cómo se verifican los fisioterapeutas?",
    a: "Validamos manualmente la colegiatura ante el Colegio de Fisioterapeutas del Perú (CFTP/CFF), DNI, antecedentes y diplomas. Solo aparecen con badge verde de Verificado quienes superan todos los filtros.",
  },
  {
    q: "¿Qué pasa si hay mala conexión en la videollamada?",
    a: "Si la sesión se interrumpe por más de 10 minutos por motivos técnicos, el fisio reprograma sin costo. Si no se logra retomar, se reembolsa el 100% del pago.",
  },
  {
    q: "¿El precio a domicilio incluye el traslado?",
    a: "Sí. Todos los precios mostrados ya incluyen el traslado dentro de los distritos que el fisio atiende. No se cobran extras al final de la sesión.",
  },
  {
    q: "¿Puedo cambiar de fisioterapeuta?",
    a: "Por supuesto. Puedes cambiar cuando quieras desde tu panel. Si lo haces durante un plan iniciado, te ayudamos a transferir las notas clínicas al nuevo profesional.",
  },
  {
    q: "¿Hay atención domingos y feriados?",
    a: "Sí, varios fisioterapeutas ofrecen horarios extendidos incluyendo fines de semana y feriados. Filtra por disponibilidad en la búsqueda.",
  },
  {
    q: "¿Las videollamadas quedan grabadas?",
    a: "No. Por privacidad médica, las videollamadas no se graban automáticamente. Solo puedes grabar tu sesión si tú y tu fisio dan consentimiento previo.",
  },
  {
    q: "¿Cuál es la política de cancelación?",
    a: "Puedes cancelar sin costo hasta 12 horas antes de la sesión. Entre 12 y 2 horas antes se cobra el 50%. Con menos de 2 horas o no presentarte se cobra el 100%. Si el fisio cancela a último momento, recibes reembolso total más un cupón de 20%.",
  },
  {
    q: "¿Cómo reagendo una cita?",
    a: "Desde 'Mis citas' en tu panel puedes reagendar gratis hasta 12 horas antes. Solo selecciona un nuevo horario disponible del mismo fisio.",
  },
];
