<CardFooter className="absolute bottom-0 left-0 right-0 p-6 bg-black/[.08] backdrop-blur-xl flex justify-between items-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                          <Button
                            className="bg-white/[.08] border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                            onClick={() => setFlippedCardId(room.id)}
                          >
                            Ver Detalhes
                          </Button>
                          <Button 
                            className="bg-blue-800 hover:bg-blue-900"
                            onClick={() => setSelectedRoom(room)}
                          >
                            Reservar Agora
                          </Button>
                        </CardFooter>