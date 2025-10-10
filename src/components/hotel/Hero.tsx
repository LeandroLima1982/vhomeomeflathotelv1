"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 p-4">
        <div className={`transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Seu Flat Hotel à Beira Mar
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Onde Conforto, Sofisticação e Natureza se Entrelaçam
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            Reserve Agora <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}