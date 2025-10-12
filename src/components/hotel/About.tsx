import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabaseClient"
import { Star } from "lucide-react"
import { useEffect, useState } from "react"

export function About() {
  const [aboutImages, setAboutImages] = useState<string[]>([])
  const [aboutText, setAboutText] = useState<string>("")

  useEffect(() => {
    async function fetchAboutData() {
      // Fetch about text
      const { data: textData, error: textError } = await supabase
        .from('hotel_info')
        .select('about_us')
        .single()

      if (textError) {
        console.error("Error fetching about text:", textError)
      } else if (textData) {
        setAboutText(textData.about_us)
      }

      // Fetch about images
      const { data: files, error: filesError } = await supabase
        .storage
        .from('gallery')
        .list('about', {
          limit: 10,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        })

      if (filesError) {
        console.error("Error listing about images:", filesError)
        return
      }

      const imageUrls = files.map(file => {
        const { data } = supabase.storage.from('gallery').getPublicUrl(`about/${file.name}`)
        return data.publicUrl
      })
      setAboutImages(imageUrls)
    }

    fetchAboutData()
  }, [])

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Sobre Nós</h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {aboutText || "Carregando descrição..."}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Carousel className="w-full max-w-md">
              <CarouselContent>
                {aboutImages.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-[4/3] items-center justify-center p-0 overflow-hidden">
                          <div
                            className="relative w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${src})` }}
                            role="img"
                            aria-label={`Imagem sobre o hotel ${index + 1}`}
                          >
                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm p-2 rounded-lg flex items-center gap-2">
                              <div className="flex">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              </div>
                              <p className="text-white text-sm font-medium">Flat Hotel à Beira-Mar</p>
                            </div>
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
      <Separator className="my-12" />
    </section>
  )
}