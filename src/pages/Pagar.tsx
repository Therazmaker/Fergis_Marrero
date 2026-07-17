import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Heart, Coffee, Sun } from "lucide-react";

export default function Pagar() {
  const [amount, setAmount] = useState<number | "">(1);
  const [paid, setPaid] = useState(false);

  const paypalOptions = {
    clientId: "AeJ8uX9_o3dFqKvRHpojmxGAuCURA5yDhddR4Bv8TQmKy8Baeiz-SwG6I2KMtFRRzVyJxInXloFYsVp2",
    currency: "USD",
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      setAmount("");
    } else {
      setAmount(val);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#4a3f35] font-sans selection:bg-[#d4e4c8] selection:text-[#2d3a24]">
      {/* Navbar Minimalista */}
      <nav className="p-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[#6b5c4b] hover:text-[#4a3f35] transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver al inicio</span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12 md:py-20 text-center">
        {paid ? (
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-[#e8dfce] animate-fade-in-up">
            <div className="w-20 h-20 bg-[#d4e4c8] text-[#4a5d3f] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="animate-pulse" />
            </div>
            <h1 className="text-4xl font-serif text-[#2d3a24] mb-4">¡Mil Gracias!</h1>
            <p className="text-lg text-[#6b5c4b] mb-8">
              Tu aporte me ayuda muchísimo a seguir creando y mejorando este rincón especial.
            </p>
            <Link 
              to="/campo"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#829e6c] text-white hover:bg-[#6c855a] transition-all transform hover:scale-105 font-medium shadow-md hover:shadow-lg"
            >
              Ir a tu Campo de Girasoles
            </Link>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-serif text-[#2d3a24] mb-6">Apoya el Proyecto</h1>
              <p className="text-lg text-[#6b5c4b] max-w-lg mx-auto">
                Si te gusta lo que hago y quieres aportar tu granito de arena, puedes hacerlo aquí. ¡El monto lo decides tú!
              </p>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-[#e8dfce] text-left">
              <label className="block text-sm font-medium text-[#6b5c4b] mb-2" htmlFor="amount">
                ¿Cuánto te gustaría aportar? (USD)
              </label>
              
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-[#829e6c] font-medium text-xl">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={handleAmountChange}
                  className="block w-full pl-10 pr-4 py-4 text-xl border-2 border-[#e8dfce] rounded-xl focus:border-[#829e6c] focus:ring-0 transition-colors bg-[#fdfdfc] text-[#2d3a24] font-medium"
                  placeholder="1"
                />
              </div>

              {/* Botones Rápidos */}
              <div className="flex flex-wrap gap-3 mb-10">
                <button onClick={() => setAmount(1)} className="px-4 py-2 rounded-full border border-[#e8dfce] hover:border-[#829e6c] hover:bg-[#f3f7ef] transition-colors flex items-center gap-2 text-sm text-[#6b5c4b]"><Coffee size={16}/> $1</button>
                <button onClick={() => setAmount(5)} className="px-4 py-2 rounded-full border border-[#e8dfce] hover:border-[#829e6c] hover:bg-[#f3f7ef] transition-colors flex items-center gap-2 text-sm text-[#6b5c4b]"><Sun size={16}/> $5</button>
                <button onClick={() => setAmount(10)} className="px-4 py-2 rounded-full border border-[#e8dfce] hover:border-[#829e6c] hover:bg-[#f3f7ef] transition-colors flex items-center gap-2 text-sm text-[#6b5c4b]"><Heart size={16}/> $10</button>
              </div>

              {/* PayPal Integration */}
              <div className="min-h-[150px] relative z-0">
                {amount === "" || amount < 1 ? (
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-800 text-sm text-center">
                    El monto mínimo es de $1 USD.
                  </div>
                ) : (
                  <PayPalScriptProvider options={paypalOptions}>
                    <PayPalButtons
                      style={{ layout: "vertical", shape: "rect", color: "gold" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: {
                                currency_code: "USD",
                                value: amount.toString(),
                              },
                              description: "Aporte Papá Girasol"
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then(async (details) => {
                          try {
                            // 1. Obtener los datos actuales del campo
                            const { data: dbData } = await supabase.from('escenario').select('datos').eq('id', 1).single();
                            let currentElements = dbData?.datos || [];
                            
                            // 2. Crear un brote con timestamp de plantado
                            const nuevoBrote = {
                              id: Date.now(),
                              type: "brote",
                              src: "/Campo/Brote.png",
                              label: "🌱 Brote nuevo",
                              x: 500 + Math.random() * 2000,
                              y: 500 + Math.random() * 700,
                              w: 100,
                              h: 100,
                              clientName: details.payer?.name?.given_name || "Aportante Mágico",
                              plantedAt: new Date().toISOString(), // ⏰ Timestamp para germinar en 24h
                            };
                            
                            currentElements.push(nuevoBrote);
                            
                            // 3. Guardar el nuevo campo en la base de datos
                            await supabase.from("escenario").upsert({ id: 1, datos: currentElements });
                          } catch (err) {
                            console.error("Error al plantar el brote automático:", err);
                          }

                          setPaid(true);
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                )}
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
