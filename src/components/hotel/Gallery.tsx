import { galleryImages } from "@/data/gallery";

export function Gallery() {
  return (
    <section id="galeria" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Conheça Nosso Flat Hotel</h2>
        <p className="text-gray-600 mt-2 mb-12">Conheça nossos ambientes</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((src, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-lg">
              <img src={src} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}