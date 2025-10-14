import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Star } from "lucide-react"

const images = [
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
]

export default function About() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  return (
    <section id="sobre" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-gray-50">
              V-Home, o seu Flat Hotel à beira-mar de Piedade.
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Viva uma experiência única de hospedagem com conforto, sofisticação e uma vista deslumbrante para o mar.
            </p>
          </div>
          <div className="flex justify-center">
            <Carousel
              plugins={[plugin.current]}
              className="w-full max-w-md"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {images.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="relative flex aspect-square items-center justify-center p-0 overflow-hidden rounded-lg">
                          <img
                            src={src}
                            alt={`V-Home Sobre ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
                            <div className="flex">
                              <Star className="w-4 h-4 fill-white" />
                              <Star className="w-4 h-4 fill-white" />
                              <Star className="w-4 h-4 fill-white" />
                              <Star className="w-4 h-4 fill-white" />
                            </div>
                            <span className="font-semibold text-sm">Flat Hotel à Beira Mar</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}