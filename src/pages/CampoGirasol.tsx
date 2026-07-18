import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

// Bicho inteligente con movimiento realista continuo
const Bicho = ({ startX, startY, width, src, flowers }: {
  startX: number;
  startY: number;
  width: number;
  src: string;
  flowers: { x: number; y: number }[];
}) => {
  const bugRef = React.useRef<HTMLImageElement>(null);
  
  // Usamos ref para mutar estado de físicas sin re-renderizar
  const physics = React.useRef({
    x: startX,
    y: startY,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    targetX: startX,
    targetY: startY,
    visiting: false,
    timer: 0,
    angle: 0
  });

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      
      const p = physics.current;
      p.timer -= dt;

      // Decisiones de IA
      if (p.timer <= 0) {
        if (p.visiting) {
          // Terminar visita y volver a explorar
          p.visiting = false;
          p.timer = 2 + Math.random() * 3;
          p.targetX = startX + (Math.random() - 0.5) * 600;
          p.targetY = startY + (Math.random() - 0.5) * 600;
        } else {
          // 30% de ir a una flor si hay
          const shouldVisit = flowers.length > 0 && Math.random() < 0.3;
          if (shouldVisit) {
            const target = flowers[Math.floor(Math.random() * flowers.length)];
            p.targetX = target.x;
            p.targetY = target.y - 30; // Posarse arribita
            p.visiting = true;
            p.timer = 4 + Math.random() * 3; // Tiempo hasta llegar y quedarse
          } else {
            // Seguir explorando
            p.targetX = startX + (Math.random() - 0.5) * 600;
            p.targetY = startY + (Math.random() - 0.5) * 600;
            p.timer = 1 + Math.random() * 2;
          }
        }
      }

      // Físicas (Steering behavior)
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Velocidad deseada
      const speed = p.visiting && dist < 50 ? 20 : 150; // frenar al llegar a la flor
      const desiredVx = dist > 0 ? (dx / dist) * speed : 0;
      const desiredVy = dist > 0 ? (dy / dist) * speed : 0;

      // Wiggle/ruido aleatorio para simular aleteo errático
      const noiseX = (Math.random() - 0.5) * 200;
      const noiseY = (Math.random() - 0.5) * 200;

      // Steering (suavizar cambio de velocidad)
      const steerStrength = p.visiting ? 2.5 : 1.5;
      p.vx += (desiredVx + noiseX - p.vx) * steerStrength * dt;
      p.vy += (desiredVy + noiseY - p.vy) * steerStrength * dt;

      // Actualizar posición
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Rotación basada en velocidad, pero suavizada
      const targetAngle = Math.atan2(p.vy, p.vx) * (180 / Math.PI);
      
      // Mantener la mariposa más o menos derecha si es necesario, 
      // pero dar giro natural. (Sumamos 90 si la imagen original mira hacia arriba)
      // Usaremos rotación simple para darle dinamismo
      p.angle += (targetAngle - p.angle) * 4 * dt;
      
      // Si el sprite está volteado horizontalmente, lo calculamos por la vx
      const flipX = p.vx < 0 ? -1 : 1;

      if (bugRef.current) {
        const leftPct = (p.x / 3000) * 100;
        const topPct = (p.y / 1688) * 100;
        const wPct = (width / 3000) * 100;
        
        bugRef.current.style.left = `${leftPct}%`;
        bugRef.current.style.top = `${topPct}%`;
        bugRef.current.style.width = `${wPct}%`;
        // Pequeño giro errático
        const rot = p.vx * 0.1; // Se inclina ligeramente al moverse en x
        bugRef.current.style.transform = `translate(-50%, -50%) scaleX(${flipX}) rotate(${rot}deg)`;
        
        if (p.visiting && dist < 50) {
           bugRef.current.style.filter = 'drop-shadow(0 0 4px rgba(255,220,0,0.7))';
        } else {
           bugRef.current.style.filter = 'none';
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [startX, startY, flowers, width]);

  return (
    <img
      ref={bugRef}
      src={src}
      style={{
        position: 'absolute',
        zIndex: 50,
        pointerEvents: 'none',
        opacity: 0.9,
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
      background: "#cce8a6",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      {/* CONTENEDOR CENTRAL: fit-dentro-del-viewport manteniendo 16:9 */}
      {/* En landscape: llena el alto. En portrait mobile: llena el ancho y se letterboxea */}
      <div style={{
        position: "relative",
        width: "min(100vw, calc(100vh * 16 / 9))",
        height: "min(100vh, calc(100vw * 9 / 16))",
        background: "url('/Campo/Campo de girasoles.png?v=3') no-repeat center center",
        backgroundSize: "cover",
        overflow: "hidden",
        opacity: loading ? 0 : 1,
        transition: "opacity 0.5s ease-in-out",
        flexShrink: 0,
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

                ) : el.type === "brote" ? (() => {
                  // 🌱→🌻 Germinar tras 24h
                  const VEINTICUATRO_HORAS = 24 * 60 * 60 * 1000;
                  const haPasado24h = el.plantedAt
                    ? Date.now() - new Date(el.plantedAt).getTime() >= VEINTICUATRO_HORAS
                    : false;

                  return haPasado24h ? (
                    // Ya es un girasol 🌻
                    <div style={{ 
                      display: "flex", flexDirection: "column", alignItems: "center", width: "100%",
                      transformOrigin: "bottom center",
                      animation: `sway-wind ${3 + (el.id % 2)}s ease-in-out infinite alternate`,
                      animationDelay: `-${el.id % 5}s`
                    }}>
                      <img src="/Campo/Girasol.gif" style={{ width: "100%" }} alt="" />
                    </div>
                  ) : (
                    // Sigue siendo un brote 🌱 (con animación de pulso suave)
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", animation: "germinar-pulso 2s ease-in-out infinite" }}>
                      <img src="/Campo/Brote.png" style={{ width: "100%", filter: "drop-shadow(0 0 6px rgba(100,200,80,0.5))" }} alt="" />
                    </div>
                  );
                })()

                : el.type === "flower" ? (
                  <div style={{ 
                    display: "flex", flexDirection: "column", alignItems: "center", width: "100%",
                    transformOrigin: "bottom center",
                    animation: `sway-wind ${3 + (el.id % 3)}s ease-in-out infinite alternate`,
                    animationDelay: `-${el.id % 7}s`
                  }}>
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
          bottom: "clamp(12px, 4vw, 20px)",
          right: "clamp(12px, 4vw, 20px)",
          zIndex: 1000,
          backgroundColor: "#829e6c",
          color: "white",
          padding: "clamp(8px, 2vw, 12px) clamp(14px, 4vw, 24px)",
          borderRadius: "9999px",
          fontFamily: "'Dancing Script', cursive",
          fontSize: "clamp(1rem, 4vw, 1.5rem)",
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
