"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <img
        alt="Hotel"
        className="h-full w-full object-cover"
        height="1080"
        src="/placeholder.svg"
        style={{
          aspectRatio: "1920/1080",
          objectFit: "cover",
        }}
        width="1920"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <div className={`transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl font-bold md:text-6xl">Seu Flat Hotel à Beira Mar</h1>
          <p className="mt-4 text-lg md:text-xl">Experimente o luxo e o conforto.</p>
        </div>
      </div>
    </section>
  );
}