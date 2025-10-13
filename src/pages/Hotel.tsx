import { useState, useEffect } from "react";
import Header from "@/components/hotel/Header";
import { Hero } from "@/components/hotel/Hero";
import { BookingForm } from "@/components/hotel/BookingForm";
import { About } from "@/components/hotel/About";
import { Amenities } from "@/components/hotel/Amenities";
import { Nearby } from "@/components/hotel/Nearby";
import { Gallery } from "@/components/hotel/Gallery";
import { Footer } from "@/components/hotel/Footer";
import Contact from "@/components/hotel/Contact";
import Rooms from "@/components/hotel/Rooms";
import { ScrollToTop } from "@/components/hotel/ScrollToTop";
import { supabase } from "@/lib/supabaseClient";

const Hotel = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!supabase) {
        console.error("Supabase client not available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .order("id");

        if (error) {
          console.error("Erro ao carregar acomodações:", error);
          setRooms([]);
        } else {
          console.log("Rooms loaded:", data);
          setRooms(data || []);
        }
      } catch (err) {
        console.error("Unexpected error loading rooms:", err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="bg-white">
      <Header />
      <main>
        <Hero />
        <BookingForm />
        <About />
        <section id="rooms" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">Nossas Acomodações</h2>
              <p className="text-gray-600 mt-2">Escolha o apartamento perfeito para sua estadia</p>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Carregando acomodações...</p>
              </div>
            ) : (
              <Rooms rooms={rooms} />
            )}
          </div>
        </section>
        <Amenities />
        <Nearby />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Hotel;