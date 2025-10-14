import Header from "@/components/hotel/Header";
import { BookingForm } from "@/components/hotel/BookingForm";
import Footer from "@/components/hotel/Footer";

const BookingV2 = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Nova Consulta de Disponibilidade (Teste)
            </h1>
            <p className="text-gray-600">
              Esta é uma página de desenvolvimento para a nova experiência de reserva.
            </p>
          </div>

          {/* Formulário de Busca */}
          <div className="mb-16">
            <BookingForm />
          </div>

          {/* Contêiner para os Resultados */}
          <div id="results-container" className="max-w-5xl mx-auto">
            {/* Os resultados da busca aparecerão aqui */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingV2;