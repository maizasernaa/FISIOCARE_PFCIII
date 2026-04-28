import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PublicLayout } from "@/components/layout/PublicLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import SearchPage from "./pages/SearchPage";
import PhysioProfile from "./pages/PhysioProfile";
import Booking from "./pages/Booking";
import PatientDashboard from "./pages/PatientDashboard";
import PhysioRegister from "./pages/PhysioRegister";
import PhysioDashboard from "./pages/PhysioDashboard";
import MyAppointments from "./pages/patient/MyAppointments";
import ClinicalNotes from "./pages/patient/ClinicalNotes";
import HomeExercises from "./pages/patient/HomeExercises";
import Messages from "./pages/patient/Messages";
import MyHealth from "./pages/patient/MyHealth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public layout (header/footer) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/buscar" element={<SearchPage />} />
            <Route path="/fisio/:id" element={<PhysioProfile />} />
            <Route path="/agendar/:id" element={<Booking />} />
            <Route path="/como-funciona" element={<Index />} />
            <Route path="/para-fisios" element={<Index />} />
          </Route>

          {/* Standalone pages */}
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/registro" element={<Auth mode="register" />} />
          <Route path="/registro-fisio" element={<PhysioRegister />} />
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/dashboard/citas" element={<MyAppointments />} />
          <Route path="/dashboard/notas" element={<ClinicalNotes />} />
          <Route path="/dashboard/ejercicios" element={<HomeExercises />} />
          <Route path="/dashboard/mensajes" element={<Messages />} />
          <Route path="/dashboard/salud" element={<MyHealth />} />
          <Route path="/dashboard-fisio" element={<PhysioDashboard />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
