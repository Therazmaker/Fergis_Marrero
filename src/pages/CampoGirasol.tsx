import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

// Bicho inteligente: explora su zona y visita flores cercanas
const Bicho = ({ startX, startY, width, src, flowers }: {
  startX: number;
  startY: number;
  width: number;
  src: string;
  flowers: { x: number; y: number }[];
}) => {
  const [pos, setPos] = useState({ x: startX, y: startY });
  const [visiting, setVisiting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      // 30% de probabilidad de ir a visitar una flor si hay alguna cerca
      const shouldVisit = !visiting && flowers.length > 0 && Math.random() < 0.3;

      if (shouldVisit) {
        // Elegir una flor aleatoria
        const target = flowers[Math.floor(Math.random() * flowers.length)];
        setVisiting(true);
        // Volar hacia la flor
        setPos({ x: target.x + (Math.random() - 0.5) * 60, y: target.y - 30 + (Math.random() - 0.5) * 40 });
        // Quedarse unos segundos y luego volver a explorar
        timeout = setTimeout(() => {
          setVisiting(false);
          setPos({
            x: startX + (Math.random() - 0.5) * 300,
            y: startY + (Math.random() - 0.5) * 300
          });
          timeout = setTimeout(tick, 1200 + Math.random() * 800);
        }, 2000 + Math.random() * 2000);
      } else {
        // Exploración libre alrededor del punto de inicio
        setPos({
          x: startX + (Math.random() - 0.5) * 400,
          y: startY + (Math.random() - 0.5) * 400
        });
        timeout = setTimeout(tick, 1200 + Math.random() * 800);
      }
    };

    timeout = setTimeout(tick, 800 + Math.random() * 600);
    return () => clearTimeout(timeout);
  }, [startX, startY, flowers, visiting]);

  const leftPct = (pos.x / 3000) * 100;
  const topPct = (pos.y / 1688) * 100;
  const wPct = (width / 3000) * 100;

  return (
    <img
      src={src}
      style={{
        position: 'absolute',
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: `${wPct}%`,
        transition: visiting
          ? 'left 1.2s cubic-bezier(.4,0,.2,1), top 1.2s cubic-bezier(.4,0,.2,1)'
          : 'left 2s ease-in-out, top 2s ease-in-out',
        zIndex: 50,
        pointerEvents: 'none',
        opacity: 0.9,
        filter: visiting ? 'drop-shadow(0 0 4px rgba(255,220,0,0.7))' : 'none',
      }}
      alt="bicho"
    />
  );
};

export default function CampoGirasol() {
  const [editorData, setEditorData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Producción (Supabase)
  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase.from('escenario').select('datos').eq('id', 1).maybeSingle();
      if (data && data.datos) {
        setEditorData(data.datos);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Elementos estáticos de la base de datos (excluyendo zonas de agua que son invisibles en producción)
  const staticElements = editorData.filter(el => !el.isWater && el.type !== 'water');

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      overflow: "hidden", 
      background: "#cce8a6", // Color del pasto para que se difumine con los bordes
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      {/* CONTENEDOR CENTRAL: Simula el espacio del campo (16:9 escalado) */}
      <div style={{
        position: "relative",
        height: "100vh",
        aspectRatio: "16 / 9",
        background: "url('/Campo/Campo de girasoles.png?v=3') no-repeat top left",
        backgroundSize: "contain",
        overflow: "hidden",
        opacity: loading ? 0 : 1,
        transition: "opacity 0.5s ease-in-out"
      }}>
        
        {/* ELEMENTOS DE LA BASE DE DATOS */}
        {(() => {
          const flowerPositions = staticElements
            .filter(el => el.type === "flower")
            .map(el => ({ x: el.x, y: el.y }));

          return staticElements.map(el => {
            // Bichos: comportamiento procedural con IA de visita a flores
            if (el.type === "mosca" || el.type === "bicho") {
              return <Bicho key={el.id} startX={el.x} startY={el.y} width={el.w} src={el.src || "/Campo/Mosca.gif"} flowers={flowerPositions} />;
            }

            const leftPct = (el.x / 3000) * 100;
            const topPct = (el.y / 1688) * 100;
            const wPct = (el.w / 3000) * 100;
            const hPct = (el.h / 1688) * 100;

            return (
              <div
                key={el.id}
                style={{
                  position: "absolute",
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `${wPct}%`,
                  zIndex: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                {el.type === "titulo" ? (
                  <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", containerType: "inline-size" }}>
                    <img src="/Campo/Titulo.png" style={{ width: "100%", display: "block" }} alt="" />
                    <div style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontFamily: "'Dancing Script', cursive", fontSize: "20cqi",
                      color: "#5a4230", fontWeight: "bold",
                      width: "100%", textAlign: "center"
                    }}>
                      {el.clientName ?? "Nombre"}
                    </div>
                  </div>

                ) : el.type === "flower" ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    <img src={el.src || "/Campo/Girasol.gif"} style={{ width: "100%" }} alt="" />
                  </div>

                ) : (
                  <div style={{ width: "100%", height: `${hPct}%` }}>
                    <img src={el.src || el.url} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} alt="" />
                  </div>
                )}
              </div>
            );
          });
        })()}

      </div>

      {/* Botón flotante para comprar una flor */}
      <Link 
        to="/pagar"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          backgroundColor: "#829e6c",
          color: "white",
          padding: "12px 24px",
          borderRadius: "9999px",
          fontFamily: "'Dancing Script', cursive",
          fontSize: "1.5rem",
          textDecoration: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.backgroundColor = "#6c855a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "#829e6c";
        }}
      >
        🌻 Comprar una Flor
      </Link>
    </div>
  );
}
