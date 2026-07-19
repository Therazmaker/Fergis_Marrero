import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

// ─── TIPOS ───────────────────────────────────────────────────────────────────
interface SceneElement {
  id: number;
  type: string;
  src: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  clientName?: string;
  isWater?: boolean;
}

// ─── BIBLIOTECA DE ASSETS CATEGORIZADA ─────────────────────────────────────────
const STATIC_LIBRARY: Record<string, { type: string; src: string; label: string; isBug?: boolean }[]> = {
  Flora: [
    { type: "flower",  src: "/Campo/Girasol.gif",  label: "🌻 Girasol" },
    { type: "junco",   src: "/Campo/Juncos.gif",   label: "🌾 Junco" },
    { type: "brote",   src: "/Campo/Brote.png",    label: "🌱 Brote" }
  ],
  Terreno: [
    { type: "tile",    src: "/Campo/Tile.png",     label: "🟫 Tierra" },
    { type: "water",   src: "",                    label: "🚫 Prohibida" }
  ],
  Bichos: [
    { type: "mosca",   src: "/Campo/Mosca.gif",    label: "🪰 Mosca", isBug: true }
  ],
  Objetos: [
    { type: "titulo",  src: "/Campo/Titulo.png",   label: "📜 Pergamino" }
  ]
};

// ─── ELEMENTO EN EL CANVAS ────────────────────────────────────────────────────
function CanvasItem({ el, zoom, onMove, onResize, onDelete, onNameChange }: {
  el: SceneElement;
  zoom: number;
  onMove: (id: number, x: number, y: number) => void;
  onResize: (id: number, w: number, h: number) => void;
  onDelete: (id: number) => void;
  onNameChange: (id: number, name: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const elStartX = el.x;
    const elStartY = el.y;

    const move = (ev: PointerEvent) => onMove(el.id, elStartX + (ev.clientX - startX) / zoom, elStartY + (ev.clientY - startY) / zoom);
    const up = () => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  };

  const isWater = el.isWater;

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onDoubleClick={() => onDelete(el.id)}
      title="Doble clic para borrar"
      style={{
        position: "absolute",
        left: el.x,
        top: el.y,
        width: el.w,
        cursor: "grab",
        userSelect: "none",
        zIndex: isWater ? 2 : el.type === "flower" ? 10 : 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Contenido */}
      {isWater ? (
        <div style={{
          width: el.w, height: el.h,
          background: "rgba(255,0,0,0.35)",
          border: "2px dashed red",
          display: "flex", alignItems: "center", justifyContent: "center",
          resize: "both", overflow: "hidden",
          boxSizing: "border-box"
        }}
          onMouseUp={(e) => {
            const t = e.currentTarget as HTMLElement;
            onResize(el.id, t.offsetWidth, t.offsetHeight);
          }}
        >
          <span style={{ color: "white", fontWeight: "bold", fontSize: 12, pointerEvents: "none" }}>Zona Prohibida</span>
        </div>

      ) : el.type === "titulo" ? (
        // Pergamino independiente con nombre editable
        <div style={{ position: "relative", width: el.w, display: "flex", justifyContent: "center", containerType: "inline-size" }}>
          <img src="/Campo/Titulo.png" style={{ width: "100%", pointerEvents: "none", display: "block" }} alt="" />
          <input
            value={el.clientName ?? "Nombre"}
            onChange={(e) => { e.stopPropagation(); onNameChange(el.id, e.target.value); }}
            onPointerDown={(e) => e.stopPropagation()}
            placeholder="Escribe el nombre..."
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "'Dancing Script', cursive", fontSize: "20cqi",
              color: "#5a4230", fontWeight: "bold",
              background: "transparent", border: "none",
              outline: "none", width: "65%", textAlign: "center", cursor: "text"
            }}
          />
        </div>

      ) : el.type === "flower" ? (
        // Flor — usa el src propio (puede ser girasol o cualquier imagen subida)
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: el.w }}>
          <img src={el.src || "/Campo/Girasol.gif"} style={{ width: "100%", pointerEvents: "none" }} alt="" />
        </div>

      ) : (
        // Imagen genérica redimensionable
        <div style={{ width: el.w, height: el.h, resize: "both", overflow: "hidden" }}
          onMouseUp={(e) => {
            const t = e.currentTarget as HTMLElement;
            onResize(el.id, t.offsetWidth, t.offsetHeight);
          }}
        >
          <img src={el.src} style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none", display: "block" }} alt="" />
        </div>
      )}

      {/* Handle de escala en esquina — disponible para todos excepto agua */}
      {!isWater && (
        <div
          style={{
            position: "absolute", bottom: 0, right: 0,
            width: 12, height: 12, background: "white",
            border: "1px solid #888", cursor: "se-resize", zIndex: 10
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            const startW = el.w;
            const startH = el.h;
            const startX = e.clientX;
            const startY = e.clientY;
            const move = (ev: PointerEvent) => {
              onResize(el.id, Math.max(40, startW + (ev.clientX - startX) / zoom), Math.max(40, startH + (ev.clientY - startY) / zoom));
            };
            const up = () => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); };
            document.addEventListener("pointermove", move);
            document.addEventListener("pointerup", up);
          }}
        />
      )}
    </div>
  );
}

// ─── EDITOR PRINCIPAL ─────────────────────────────────────────────────────────
export default function Editor() {
  const [elements, setElements] = useState<SceneElement[]>([]);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingLibItem, setDraggingLibItem] = useState<{ type: string; src: string; label: string; isBug?: boolean } | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const [uploadCategory, setUploadCategory] = useState<"Flora" | "Bichos" | "Objetos">("Flora");
  const [dynamicLibrary, setDynamicLibrary] = useState<Record<string, { type: string; src: string; label: string; isBug?: boolean }[]>>({});
  const [zoom, setZoom] = useState(0.4);

  // Cargar assets del bucket de Supabase
  const loadCustomAssets = async () => {
    const { data, error } = await supabase.storage.from('assets').list();
    if (error || !data) return;
    const byCategory: Record<string, { type: string; src: string; label: string; isBug?: boolean }[]> = {};
    data.forEach(file => {
      // Prefijo del archivo determina la categoría: flower_, bicho_, obj_
      let cat = "Objetos";
      let type = "image";
      let isBug = false;
      if (file.name.startsWith("flower_")) { cat = "Flora"; type = "flower"; }
      else if (file.name.startsWith("bicho_")) { cat = "Bichos"; type = "bicho"; isBug = true; }
      const { data: urlData } = supabase.storage.from('assets').getPublicUrl(file.name);
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push({ type, src: urlData.publicUrl, label: "📎 " + file.name.replace(/^(flower_|bicho_|obj_)/, "").replace(/\.[^.]+$/, ""), isBug });
    });
    setDynamicLibrary(byCategory);
  };

  // Cargar desde Supabase y assets del bucket
  useEffect(() => {
    supabase.from("escenario").select("datos").eq("id", 1).maybeSingle().then(({ data }) => {
      if (data && data.datos) setElements(data.datos as SceneElement[]);
    });
    loadCustomAssets();
  }, []);

  // Guardar en Supabase
  const saveData = async () => {
    setSaving(true);
    // Usar upsert para crear la fila si no existe
    const { error } = await supabase.from("escenario").upsert({ id: 1, datos: elements });
    setStatusMsg(error ? "Error: " + error.message : "¡Guardado en Producción! 🚀");
    setSaving(false);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const updateElement = (id: number, x: number, y: number) =>
    setElements(els => els.map(e => e.id === id ? { ...e, x, y } : e));

  const resizeElement = (id: number, w: number, h: number) =>
    setElements(els => els.map(e => e.id === id ? { ...e, w, h } : e));

  const deleteElement = (id: number) =>
    setElements(els => els.filter(e => e.id !== id));

  const updateName = (id: number, name: string) =>
    setElements(els => els.map(e => e.id === id ? { ...e, clientName: name } : e));

  const handleDeleteCustomAsset = async (itemSrc: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("¿Seguro que quieres borrar este elemento de la biblioteca?")) return;
    const fileName = itemSrc.split('/').pop();
    if (fileName) {
      await supabase.storage.from('assets').remove([fileName]);
      loadCustomAssets();
    }
  };

  // ── Arrastrar desde biblioteca al canvas ──────────────────────────────────
  const handleLibPointerDown = (item: typeof LIBRARY[0], e: React.PointerEvent) => {
    e.preventDefault();
    setDraggingLibItem(item);

    // Crear fantasma visual
    const ghost = document.createElement("div");
    ghost.style.cssText = `position:fixed;pointer-events:none;z-index:9999;opacity:0.7;transform:translate(-50%,-50%);`;
    if (item.src) {
      const img = document.createElement("img");
      img.src = item.src;
      img.style.cssText = "width:80px;height:80px;object-fit:contain;";
      ghost.appendChild(img);
    } else {
      ghost.innerHTML = `<div style="width:80px;height:40px;background:rgba(255,0,0,0.4);border:2px dashed red;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:bold;">Zona Prohibida</div>`;
    }
    ghost.style.left = e.clientX + "px";
    ghost.style.top = e.clientY + "px";
    document.body.appendChild(ghost);
    ghostRef.current = ghost;

    const move = (ev: PointerEvent) => {
      if (ghostRef.current) {
        ghostRef.current.style.left = ev.clientX + "px";
        ghostRef.current.style.top = ev.clientY + "px";
      }
    };

    const up = (ev: PointerEvent) => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      if (ghostRef.current) { document.body.removeChild(ghostRef.current); ghostRef.current = null; }
      setDraggingLibItem(null);

      // Calcular posición relativa al canvas
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (ev.clientX - rect.left) / zoom - 50;
        const y = (ev.clientY - rect.top) / zoom - 50;

        const isWater = item.type === "water";
        const newEl: SceneElement = {
          id: Date.now(),
          type: item.type,
          src: item.src,
          label: item.label,
          x: Math.max(0, x),
          y: Math.max(0, y),
          w: isWater ? 200 : item.type === "flower" ? 120 : 100,
          h: isWater ? 200 : 100,
          isWater,
          clientName: item.type === "flower" ? "Nombre" : undefined,
        };
        setElements(els => [...els, newEl]);
      }
    };

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  };

  const handleUploadCustomImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMsg("Subiendo imagen...");

    // Prefijo según categoría
    const prefix = uploadCategory === "Flora" ? "flower_" : uploadCategory === "Bichos" ? "bicho_" : "obj_";
    const fileExt = file.name.split('.').pop();
    const fileName = `${prefix}${Date.now()}.${fileExt}`;

    // Subir a Supabase
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(fileName, file);

    if (error) {
      console.error(error);
      setStatusMsg("Error subiendo: " + error.message);
      setTimeout(() => setStatusMsg(""), 4000);
      return;
    }

    // Obtener la URL pública
    const { data: publicUrlData } = supabase.storage
      .from('assets')
      .getPublicUrl(fileName);

    const url = publicUrlData.publicUrl;

    const isBug = uploadCategory === "Bichos";
    const isFlower = uploadCategory === "Flora";
    const newElement: SceneElement = {
      id: Date.now(),
      type: isBug ? "bicho" : isFlower ? "flower" : "image",
      x: 300, y: 300,
      w: 150, h: 150,
      url: url,
      src: url,
      label: "Custom"
    };
    setElements([...elements, newElement]);
    setStatusMsg("Imagen añadida ✔️");
    setTimeout(() => setStatusMsg(""), 3000);
    loadCustomAssets(); // Refrescar la biblioteca
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", overflow: "hidden", background: "#1a1a2e", fontFamily: "sans-serif" }}>

      {/* ── BIBLIOTECA ────────────────────────────────────────────────────── */}
      <div style={{
        width: 200, padding: 16, background: "#16213e",
        color: "white", display: "flex", flexDirection: "column", gap: 8,
        overflowY: "auto", boxShadow: "2px 0 12px rgba(0,0,0,0.4)", zIndex: 100
      }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: 14, color: "#e0e0e0", textTransform: "uppercase", letterSpacing: 1 }}>Biblioteca</h3>
        <p style={{ fontSize: 11, color: "#aaa", margin: "0 0 12px 0" }}>Arrastra al campo 👉</p>

        {/* BIBLIOTECA ESTÁTICA + DINÁMICA */}
        {Object.entries(STATIC_LIBRARY).map(([category, items]) => {
          const dynItems = dynamicLibrary[category] || [];
          const allItems = [...items, ...dynItems];
          return (
            <div key={category} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, borderBottom: "1px solid #333", paddingBottom: 4 }}>
                {category}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {allItems.map((item, i) => (
                  <div
                    key={item.src + i}
                    onPointerDown={(e) => handleLibPointerDown(item, e)}
                    style={{
                      position: "relative",
                      background: "#0f3460", borderRadius: 8, padding: 8,
                      cursor: "grab", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 4, border: "1px solid #1a4a8a",
                      transition: "background 0.2s", userSelect: "none"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#1a5276")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#0f3460")}
                  >
                    {/* Botón borrar solo para items dinámicos (los que tienen URL de supabase) */}
                    {item.src.includes('supabase.co') && (
                      <button
                        onPointerDown={(e) => handleDeleteCustomAsset(item.src, e)}
                        style={{
                          position: "absolute", top: -5, right: -5,
                          background: "#e74c3c", color: "white", border: "none",
                          borderRadius: "50%", width: 18, height: 18,
                          fontSize: 10, cursor: "pointer", display: "flex",
                          alignItems: "center", justifyContent: "center", zIndex: 10
                        }}
                        title="Borrar de la biblioteca"
                      >
                        ✕
                      </button>
                    )}

                    {item.src
                      ? <img src={item.src} style={{ width: 36, height: 36, objectFit: "contain" }} alt="" />
                      : <div style={{ width: 36, height: 20, background: "rgba(255,0,0,0.4)", border: "1px dashed red", borderRadius: 2 }} />
                    }
                    <span style={{ fontSize: 9, color: "#ccc", textAlign: "center" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* BOTÓN PARA SUBIR IMAGEN PERSONALIZADA */}
        <div style={{ marginTop: 20, borderTop: "1px solid #333", paddingTop: 16 }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: 12, color: "#ccc" }}>Subir tu propio GIF/PNG</h4>

          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 10, color: "#aaa", display: "block", marginBottom: 4 }}>Categoría:</label>
            <select
              value={uploadCategory}
              onChange={e => setUploadCategory(e.target.value as "Flora" | "Bichos" | "Objetos")}
              style={{ width: "100%", background: "#0f3460", color: "white", border: "1px solid #1a4a8a", borderRadius: 6, padding: "4px 6px", fontSize: 11, cursor: "pointer" }}
            >
              <option value="Flora">🌸 Flora (planta)</option>
              <option value="Bichos">🦋 Bichos (vuela)</option>
              <option value="Objetos">📦 Objetos</option>
            </select>
          </div>

          <label style={{
            display: "block",
            background: "#10b981", color: "white", textAlign: "center",
            padding: "8px 12px", borderRadius: 8, cursor: "pointer",
            fontSize: 12, fontWeight: "bold", transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#059669"}
          onMouseLeave={e => e.currentTarget.style.background = "#10b981"}
          >
            📁 Cargar Archivo
            <input type="file" accept="image/png, image/gif, image/jpeg" style={{ display: "none" }} onChange={handleUploadCustomImage} />
          </label>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ fontSize: 10, color: "#666", lineHeight: 1.5 }}>
          <p>✋ Arrastra para añadir</p>
          <p>🔀 Arrastra en el canvas para mover</p>
          <p>↔️ Esquina blanca para escalar</p>
          <p>❌ Doble clic para borrar</p>
        </div>

        <div style={{ marginTop: 20, borderTop: "1px solid #333", paddingTop: 16 }}>
          <label style={{ fontSize: 10, color: "#aaa", display: "block", marginBottom: 4 }}>Zoom del Canvas ({Math.round(zoom * 100)}%)</label>
          <input
            type="range" min="0.1" max="1.5" step="0.05"
            value={zoom}
            onChange={e => setZoom(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "#27ae60", cursor: "pointer" }}
          />
        </div>

        <button
          onClick={saveData}
          disabled={saving}
          style={{
            padding: 12, background: saving ? "#555" : "#27ae60",
            color: "white", fontWeight: "bold", cursor: saving ? "default" : "pointer",
            border: "none", borderRadius: 8, marginTop: 8, fontSize: 13
          }}
        >
          {saving ? "Guardando..." : "💾 Guardar en Producción"}
        </button>
        {statusMsg && <div style={{ color: "#2ecc71", fontSize: 11, textAlign: "center" }}>{statusMsg}</div>}
      </div>

      {/* ── CANVAS ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "auto", background: "#0d0d1a" }}>
        <div
          ref={canvasRef}
          style={{
            width: 3000, height: 1688, margin: 40,
            background: "url('/Campo/Campo de girasoles.png?v=3') no-repeat top left",
            backgroundSize: "contain",
            position: "relative",
            boxShadow: "0 0 30px rgba(0,0,0,0.7)",
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          {elements.map(el => (
            <CanvasItem
              key={el.id}
              el={el}
              zoom={zoom}
              onMove={updateElement}
              onResize={resizeElement}
              onDelete={deleteElement}
              onNameChange={updateName}
            />
          ))}
        </div>
      </div>

      {/* Cursor fantasma */}
      {draggingLibItem && (
        <div style={{ position: "fixed", bottom: 20, right: 20, background: "#27ae60", color: "white", padding: "6px 12px", borderRadius: 20, fontSize: 12, zIndex: 9999, pointerEvents: "none" }}>
          Soltando en el campo...
        </div>
      )}
    </div>
  );
}
