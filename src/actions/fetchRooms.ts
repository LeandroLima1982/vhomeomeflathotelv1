"use client";

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  amenities: string[];
}

const mockRooms: Room[] = [
  {
    id: 1,
    name: "Quarto Queen Deluxe",
    description: "Um quarto espaçoso com vista para o mar e todas as comodidades modernas.",
    price: 350,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    amenities: ["Vista para o mar", "Wi-Fi", "Ar-condicionado", "TV a Cabo"],
  },
  {
    id: 2,
    name: "Suíte Executiva",
    description: "Ideal para viajantes de negócios, com uma área de trabalho dedicada.",
    price: 450,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    amenities: ["Wi-Fi de alta velocidade", "Mesa de trabalho", "Cafeteira", "Frigobar"],
  },
  {
    id: 3,
    name: "Quarto Família",
    description: "Confortável para toda a família, com duas camas queen size.",
    price: 550,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    amenities: ["2 Camas Queen", "Banheira", "Wi-Fi", "Vista para a piscina"],
  },
];

export const fetchRooms = async (): Promise<Room[]> => {
  // Simula uma chamada de API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockRooms);
    }, 1000); // Atraso de 1 segundo para simular o carregamento
  });
};