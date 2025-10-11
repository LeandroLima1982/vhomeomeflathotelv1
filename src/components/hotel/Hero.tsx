import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative h-[80vh] w-full">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <img
        src="/placeholder.jpg"
        alt="Hero Background"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          Bem-vindo ao Hotel Paraíso
        </h1>
        <p className="mt-4 max-w-2xl text-lg sm:text-xl">
          Experimente o luxo e o conforto em nosso oásis de tranquilidade.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/gallery">
            <Button size="lg" className="text-lg px-8 py-6">
              Ver Mais
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}