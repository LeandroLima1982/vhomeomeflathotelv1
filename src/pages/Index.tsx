import { BookingForm } from "@/components/hotel/BookingForm";
import { RoomList } from "@/components/hotel/RoomList";

export default function Index() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      <div className="min-h-screen bg-black/40">
        <div className="container mx-auto p-4">
          <header className="text-center my-8">
            <h1 className="text-4xl font-bold text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
              Bem-vindo ao Hotel Dyad
            </h1>
            <p className="text-xl text-gray-200 mt-2 [text-shadow:_0_1px_2px_rgb(0_0_0_/_50%)]">
              Sua estadia de luxo começa aqui.
            </p>
          </header>
          <main>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <BookingForm />
              </div>
              <div className="lg:col-span-2">
                <RoomList />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}