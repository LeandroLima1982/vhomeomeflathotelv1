import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hotel from "./pages/Hotel";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import SupabaseProvider from "./components/SupabaseProvider";
import Institutional from "./pages/Institutional";
import ScrollToTopOnNavigate from "./components/ScrollToTopOnNavigate";
import BookingV2 from "./pages/BookingV2";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
      }, 500);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTopOnNavigate />
          <SupabaseProvider>
            <Routes>
              <Route path="/" element={<Hotel />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/institucional" element={<Institutional />} />
              <Route path="/booking-v2" element={<BookingV2 />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SupabaseProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;