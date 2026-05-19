export type Modality = "domicilio" | "videollamada";

export interface Review {
  id: string;
  patient: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Physio {
  id: string;
  name: string;
  photo: string;
  specialties: string[];
  verified: boolean;
  pricePerSession: number;
  rating: number;
  reviewCount: number;
  modalities: Modality[];
  districts: string[];
  bio: string;
  experience: number;
  colegiatura: string;
  reviews: Review[];
  availability: { date: string; slots: string[] }[];
}

export interface Appointment {
  id: string;
  physioId: string;
  physioName: string;
  date: string;
  time: string;
  modality: Modality;
  status: "upcoming" | "completed" | "cancelled";
  price: number;
  notes?: string;
  exercises?: string[];
}

export const LIMA_DISTRICTS = [
  "Miraflores", "San Isidro", "Surco", "La Molina", "San Borja",
  "Barranco", "Chorrillos", "Jesús María", "Lince", "Magdalena",
  "Pueblo Libre", "San Miguel", "Los Olivos", "San Martín de Porres",
];

export const SPECIALTIES = [
  "Traumatológica", "Deportiva", "Neurológica", "Pediátrica",
  "Geriátrica", "Respiratoria", "Postoperatoria", "Dolor crónico",
];

const today = new Date();
const dayStr = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
};

const baseAvailability = [
  { date: dayStr(0), slots: ["09:00", "11:00", "15:00"] },
  { date: dayStr(1), slots: ["08:00", "10:00", "14:00", "16:00"] },
  { date: dayStr(2), slots: ["09:00", "12:00", "17:00"] },
  { date: dayStr(3), slots: ["10:00", "15:00"] },
  { date: dayStr(4), slots: ["08:00", "11:00", "13:00", "18:00"] },
  { date: dayStr(5), slots: ["09:00", "16:00"] },
];

export const PHYSIOS: Physio[] = [
  {
    id: "p1",
    name: "Dra. Lucía Mendoza",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    specialties: ["Traumatológica", "Deportiva"],
    verified: true,
    pricePerSession: 120,
    rating: 4.9,
    reviewCount: 87,
    modalities: ["domicilio", "videollamada"],
    districts: ["Miraflores", "San Isidro", "Barranco"],
    bio: "Más de 10 años acompañando recuperaciones post-quirúrgicas y lesiones deportivas. Enfoque humano y basado en evidencia.",
    experience: 10,
    colegiatura: "CFTP-12345",
    reviews: [
      { id: "r1", patient: "Andrea G.", rating: 5, date: "Hace 2 semanas", comment: "Excelente profesional, muy puntual y empática. Mi rodilla mejoró notablemente." },
      { id: "r2", patient: "Carlos R.", rating: 5, date: "Hace 1 mes", comment: "Recomendadísima. Me explicó cada ejercicio con paciencia." },
      { id: "r3", patient: "María L.", rating: 4, date: "Hace 2 meses", comment: "Muy buena atención a domicilio." },
    ],
    availability: baseAvailability,
  },
  {
    id: "p2",
    name: "Lic. Diego Fernández",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    specialties: ["Deportiva", "Dolor crónico"],
    verified: true,
    pricePerSession: 90,
    rating: 4.7,
    reviewCount: 62,
    modalities: ["domicilio"],
    districts: ["Surco", "La Molina", "San Borja"],
    bio: "Fisioterapeuta deportivo con experiencia en clubes de fútbol profesional. Especialista en lesiones musculares.",
    experience: 7,
    colegiatura: "CFTP-23456",
    reviews: [
      { id: "r4", patient: "José M.", rating: 5, date: "Hace 1 semana", comment: "Me ayudó a recuperarme de un desgarro en tiempo récord." },
      { id: "r5", patient: "Patricia V.", rating: 4, date: "Hace 3 semanas", comment: "Muy profesional, recomendado." },
    ],
    availability: baseAvailability,
  },
  {
    id: "p3",
    name: "Lic. Patricia Quispe",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    specialties: ["Neurológica", "Geriátrica"],
    verified: true,
    pricePerSession: 110,
    rating: 5.0,
    reviewCount: 134,
    modalities: ["domicilio", "videollamada"],
    districts: ["San Isidro", "Miraflores", "Jesús María", "Lince"],
    bio: "Especialista en rehabilitación neurológica y atención a adultos mayores. Trato cálido y personalizado.",
    experience: 14,
    colegiatura: "CFTP-34567",
    reviews: [
      { id: "r6", patient: "Familia Torres", rating: 5, date: "Hace 5 días", comment: "Atendió a mi padre con mucho cariño y profesionalismo." },
      { id: "r7", patient: "Rosa M.", rating: 5, date: "Hace 2 semanas", comment: "La mejor decisión para la rehabilitación de mi mamá." },
    ],
    availability: baseAvailability,
  },
  {
    id: "p4",
    name: "Lic. Carlos Vásquez",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    specialties: ["Postoperatoria", "Traumatológica"],
    verified: true,
    pricePerSession: 100,
    rating: 4.6,
    reviewCount: 45,
    modalities: ["videollamada"],
    districts: ["Los Olivos", "San Martín de Porres"],
    bio: "Acompañamiento integral en recuperación post-quirúrgica. Modalidad online con planes de ejercicios personalizados.",
    experience: 6,
    colegiatura: "CFTP-45678",
    reviews: [
      { id: "r8", patient: "Luis F.", rating: 5, date: "Hace 1 semana", comment: "Excelente seguimiento por videollamada." },
    ],
    availability: baseAvailability,
  },
  {
    id: "p5",
    name: "Dra. Andrea Salazar",
    photo: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face",
    specialties: ["Pediátrica", "Respiratoria"],
    verified: true,
    pricePerSession: 130,
    rating: 4.9,
    reviewCount: 98,
    modalities: ["domicilio", "videollamada"],
    districts: ["Miraflores", "San Borja", "Surco"],
    bio: "Fisioterapia pediátrica y respiratoria. Trabajo lúdico y respetuoso con cada niño.",
    experience: 9,
    colegiatura: "CFTP-56789",
    reviews: [
      { id: "r9", patient: "Mamá de Lucas", rating: 5, date: "Hace 3 días", comment: "Mi hijo la adora, hace cada sesión un juego." },
    ],
    availability: baseAvailability,
  },
  {
    id: "p6",
    name: "Lic. Renato Ríos",
    photo: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
    specialties: ["Deportiva", "Traumatológica"],
    verified: false,
    pricePerSession: 70,
    rating: 4.3,
    reviewCount: 18,
    modalities: ["domicilio"],
    districts: ["Chorrillos", "Barranco"],
    bio: "Recién egresado, enfoque deportivo. Tarifas accesibles.",
    experience: 2,
    colegiatura: "CFTP-67890",
    reviews: [
      { id: "r10", patient: "Sergio P.", rating: 4, date: "Hace 1 mes", comment: "Buena atención, precio justo." },
    ],
    availability: baseAvailability,
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "a0", physioId: "p1", physioName: "Dra. Lucía Mendoza",
    date: dayStr(0), time: "18:00", modality: "videollamada",
    status: "upcoming", price: 120,
  },
  {
    id: "a1", physioId: "p1", physioName: "Dra. Lucía Mendoza",
    date: dayStr(2), time: "11:00", modality: "domicilio",
    status: "upcoming", price: 120,
  },
  {
    id: "a2", physioId: "p3", physioName: "Lic. Patricia Quispe",
    date: dayStr(-7), time: "10:00", modality: "videollamada",
    status: "completed", price: 110,
    notes: "Buena evolución de movilidad cervical. Continuar con ejercicios de estiramiento 3x día. Próxima sesión: progresar a banda elástica.",
    exercises: [
      "Estiramiento cervical lateral, 10 reps cada lado, 3x día",
      "Rotaciones suaves de cuello, 8 reps, 2x día",
      "Fortalecimiento isométrico con toalla, 15 seg x 5 reps",
    ],
  },
  {
    id: "a3", physioId: "p1", physioName: "Dra. Lucía Mendoza",
    date: dayStr(-14), time: "15:00", modality: "domicilio",
    status: "completed", price: 120,
    notes: "Sesión de evaluación inicial. Diagnóstico: tendinitis rotuliana leve. Plan de 6 sesiones.",
    exercises: [
      "Sentadilla isométrica contra pared, 30 seg x 4 reps",
      "Elevación de pierna recta, 12 reps x 3 series",
      "Aplicar hielo 15 min post-ejercicio",
    ],
  },
  {
    id: "a4", physioId: "p5", physioName: "Dra. Andrea Salazar",
    date: dayStr(-30), time: "09:00", modality: "videollamada",
    status: "completed", price: 130,
    notes: "Ejercicios respiratorios. Excelente respuesta del paciente.",
    exercises: [
      "Respiración diafragmática, 5 min, 3x día",
      "Soplado con pajita en agua, 10 reps, 2x día",
    ],
  },
];

export interface ChatPreview {
  physioId: string;
  physioName: string;
  photo: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export const RECENT_CHATS: ChatPreview[] = [
  { physioId: "p1", physioName: "Dra. Lucía Mendoza", photo: PHYSIOS[0].photo, lastMessage: "Recuerda hacer los estiramientos 3 veces al día.", time: "10:31", unread: 2 },
  { physioId: "p3", physioName: "Lic. Patricia Quispe", photo: PHYSIOS[2].photo, lastMessage: "Te envié la rutina actualizada.", time: "Ayer", unread: 0 },
];

export const PHYSIO_RECENT_CHATS: ChatPreview[] = [
  { physioId: "tp1", physioName: "Andrea Gómez", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", lastMessage: "Doctora, ¿puedo cambiar mi cita?", time: "09:12", unread: 3 },
  { physioId: "tp2", physioName: "Carlos Ramos", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200", lastMessage: "Gracias por la sesión 🙏", time: "Ayer", unread: 0 },
];

export const PHYSIO_TODAY_PATIENTS = [
  { id: "tp1", name: "Andrea Gómez", time: "09:00", modality: "domicilio" as Modality, district: "Miraflores", reason: "Rehabilitación rodilla" },
  { id: "tp2", name: "Carlos Ramos", time: "11:00", modality: "videollamada" as Modality, district: "—", reason: "Dolor lumbar crónico" },
  { id: "tp3", name: "María López", time: "15:00", modality: "domicilio" as Modality, district: "San Isidro", reason: "Postoperatorio hombro" },
  { id: "tp4", name: "José Mendoza", time: "17:00", modality: "domicilio" as Modality, district: "Barranco", reason: "Lesión deportiva" },
];
