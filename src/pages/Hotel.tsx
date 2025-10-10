import { Header } from "@/components/hotel/Header";
import { Hero } from "@/components/hotel/Hero";
import { BookingForm } from "@/components/hotel/BookingForm";
import { About } from "@/components/hotel/About";
import { Amenities } from "@/components/hotel/Amenities";
import { Testimonials } from "@/components/hotel/Testimonials";
import { Nearby } from "@/components/hotel/Nearby";
import { Gallery } from "@/components/hotel/Gallery";
import { Footer } from "@/components/hotel/Footer";

const Hotel = () => {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <Hero />
        <BookingForm />
        <About />
        <Amenities />
        <Testimonials />
        <Nearby />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
};

export default Hotel;