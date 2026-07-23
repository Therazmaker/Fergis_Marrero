import { useState, useEffect, useRef } from "react";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import AuthModal from '../components/AuthModal';
import AccountModal from '../components/AccountModal';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Mail,
  Instagram,
  Music2,
  Youtube,
  ShoppingBag,
  CreditCard,
  Smartphone,
  Landmark,
  DollarSign,
  Linkedin,
} from "lucide-react";

/* ─── Paths a imágenes en /public/Recursos ─── */
const R = "/Recursos/";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Sobre mí", href: "/sobre-mi-mama-girasol.html" },
  { label: "Acompañamiento", href: "/guia_autoexploracion_neurodivergente_para_compra_en_web.html" },
  { label: "Biblioteca", href: "/biblioteca_y_papeleria_mama_girasolparacompra_en_web.html" },
  { label: "Tienda", href: "/la-tiendita-girasolparalaweb.html" },
  { label: "El diario de Mamá Girasol", href: "/el_diario_de_mama_girasol.html" },
  { label: "Recursos Gratuitos", href: "/recursos_de_regalo_mama_girasol.html" },
  { label: "Contacto", href: "https://wa.me/51907671044" },
];

const FEATURES = [
  { img: `${R}icono-corazon.png`,        label: "Acompañamiento\npersonalizado", size: 38 },
  { img: `${R}libro abierto.png`,         label: "Recursos creados\ncon amor" },
  { img: `${R}Cerebro.png`,               label: "Enfoque\nneuroafirmativo" },
  { img: `${R}Casita.png`,               label: "Espacio seguro\ny sin juicios" },
  { img: `${R}icono-libros.png`,          label: "Clases de\ninglés" },
  { img: `${R}icono-taza-te.png`,         label: "Un poco de\ncalma", size: 54 },
];

const CATEGORIES = [
  {
    title: "Acompañamiento emocional",
    desc: "Sesiones 1:1 para ti.",
    img: `${R}Abrazo.png`,
    href: "/servicios.html",
  },
  {
    title: "Tiendita Girasol",
    desc: "Artículos personalizados.",
    img: `${R}Vestido.png`,
    href: "/la-tiendita-girasolparalaweb.html",
  },
  {
    title: "Recursos de regalo",
    desc: "Material descargable.",
    img: `${R}Regalo.png`,
    size: 150,
    href: "/recursos_de_regalo_mama_girasol.html",
  },
  {
    title: "El Diario de Mamá Girasol",
    desc: "Desahogo neurodivergente.",
    img: `${R}Cartas.png`,
    href: "/el_diario_de_mama_girasol.html",
  },
  {
    title: "Biblioteca de recursos",
    desc: "Guías y herramientas para aprender de ti y cuidarte.",
    img: `${R}Biblioteca de recursos.png`,
    size: 150,
    href: "/biblioteca_y_papeleria_mama_girasolparacompra_en_web.html",
  },
  {
    title: "Tu espacio cozy",
    desc: "Un lugar para estar.",
    img: `${R}Muebles.png`,
    href: "/tu-espacio-cozy-interactivo-definitivo.html",
  },
];

const PRODUCTS = [
  {
    title: "Sesiones 1:1 • Un ratito con Mamá Girasol",
    badge: null,
    img: `${R}Un ratito con mamá girasol2.png`,
    href: "/un_ratito_con_mama_girasolparacompra_en_web.html",
  },
  {
    title: "Acompañamiento emocional • Un camino para florecer",
    badge: "Más popular",
    img: `${R}Un camino para florecer2.png`,
    href: "/un_camino_para_florecerrpara_compra_en_web.html",
  },
  {
    title: "Test de autoexploración neurodivergente",
    badge: null,
    img: `${R}Exploración neurodivergente2.png`,
    href: "/guia_autoexploracion_neurodivergente_para_compra_en_web.html",
  },
  {
    title: "Biblioteca Mamá Girasol",
    badge: null,
    img: `${R}Biblioteca mamá girasol.png`,
    href: "/biblioteca_y_papeleria_mama_girasolparacompra_en_web.html",
  },
  {
    title: "Clases de inglés con Papá Girasol",
    badge: null,
    img: `${R}inglés 2.png`,
    href: "/clases-de-ingles.html",
  },
  {
    title: "Campo de Flores • Apoya el proyecto",
    badge: null,
    img: `${R}campo_flores.png`,
    href: "/campo",
  },
  {
    title: "La Tiendita Girasol • Prendas con esencia",
    badge: "Nuevo",
    img: `${R}tiendita_cottagecore.png`,
    href: "/la-tiendita-girasolparalaweb.html",
  },
];

/* ─── Estilos inline compartidos ─── */
const SERIF  = "'Cormorant Garamond', 'Georgia', serif";
const SCRIPT = "'Dancing Script', cursive";
const SANS   = "'Nunito', sans-serif";

const CREAM   = "#fdf8f1";
const CREAM2  = "#f7f0e6";
const CREAM3  = "#ede3d3";
const BROWN   = "#2c1f0e";
const BROWN2  = "#5a4230";
const BROWN3  = "#7a6048";
const YELLOW  = "#F6D67C";
const YELLOW2 = "#E5B64C";
const GOLD    = "#c8891a";
const GOLD2   = "#f5c842";

const Pinterest = ({ size = 24, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
    <path d="M12 22v-9" />
    <path d="M12 13a3 3 0 0 1 3-3 3 3 0 0 1 3 3c0 2-1 4-3 4s-3-1-3-1" />
  </svg>
);

export default function Home() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={{ background: CREAM2, fontFamily: SANS, color: BROWN, minHeight: "100vh" }}>

      {/* ─── TOP BAR ─── */}
      <div style={{ background: YELLOW, color: BROWN, textAlign: "center", padding: "7px 16px", fontSize: "0.78rem", letterSpacing: "0.02em", fontWeight: 700 }}>
        🌻 Bienvenida a la casita de Mamá Girasol 🌻 · Un espacio seguro para cerebros diferentes.
      </div>

      {/* ─── NAVBAR ─── */}
      <nav style={{ background: "rgba(253,248,241,0.97)", borderBottom: `1px solid rgba(100,70,30,0.15)`, backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <img src={`${R}icono-girasoles.png`} alt="Logo Mamá Girasol" style={{ width: 48, height: 48, objectFit: "contain" }} />
            <div>
              <div style={{ fontFamily: SCRIPT, fontSize: "1.4rem", color: BROWN, fontWeight: 700, lineHeight: 1 }}>Mamá</div>
              <div style={{ fontFamily: SCRIPT, fontSize: "1.4rem", color: BROWN, fontWeight: 700, lineHeight: 1 }}>Girasol</div>
              <div style={{ fontSize: "0.58rem", color: BROWN3, letterSpacing: "0.04em", marginTop: 1 }}>acompañamiento neurodivergente</div>
            </div>
          </div>

          {/* Desktop nav */}
          <ul style={{ display: "flex", gap: 2, listStyle: "none", margin: 0, padding: 0, alignItems: "center" }} className="hidden-mobile">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="nav-link"
                  style={{ padding: "6px 10px", borderRadius: 6, fontSize: "0.82rem", fontWeight: 600, color: BROWN, textDecoration: "none", display: "block", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = YELLOW)}
                  onMouseLeave={e => (e.currentTarget.style.color = BROWN)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/*
            <button style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: BROWN, padding: 6 }}>
              <ShoppingCart size={20} />
              <span style={{ position: "absolute", top: 0, right: 0, background: GOLD, color: "#fff", borderRadius: "50%", width: 14, height: 14, fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>2</span>
            </button>
            <button onClick={() => user ? setShowAccountModal(true) : setShowAuthModal(true)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 20, background: YELLOW, color: BROWN, border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}>
              <User size={15} /> Mi cuenta
            </button>
            */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: YELLOW, padding: 6, display: "none" }}
              className="hamburger"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ background: CREAM, borderTop: `1px solid rgba(100,70,30,0.12)`, padding: "12px 20px 16px" }}>
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} style={{ display: "block", padding: "8px 0", fontSize: "0.9rem", fontWeight: 600, color: BROWN, textDecoration: "none", borderBottom: `1px solid rgba(100,70,30,0.08)` }}>{link.label}</a>
            ))}
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ background: CREAM2, position: "relative", overflow: "hidden" }}>
        {/* torn paper edge top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 18, background: CREAM, clipPath: "polygon(0 0,100% 0,100% 40%,97% 100%,94% 50%,90% 100%,87% 60%,83% 100%,80% 40%,76% 100%,73% 55%,70% 100%,66% 45%,62% 100%,58% 50%,54% 100%,50% 40%,46% 100%,42% 55%,38% 100%,34% 45%,30% 100%,26% 50%,22% 100%,18% 40%,14% 100%,10% 55%,6% 100%,3% 50%,0 100%)", zIndex: 1, opacity: 0.9 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }} className="hero-grid">

          {/* Left */}
          <div style={{ zIndex: 2 }}>
            {/* decorative flora left */}
            <div style={{ position: "absolute", left: 0, top: 80, opacity: 0.35, pointerEvents: "none" }}>
              <img src={`${R}Picsart_26-07-10_21-58-27-118(2).png`} alt="" style={{ width: 120, transform: "scaleX(-1)" }} />
            </div>

            <p style={{ fontSize: "1rem", color: BROWN3, marginBottom: 6, fontStyle: "italic", fontFamily: SCRIPT }}>Bienvenida a tu lugar seguro ♥</p>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: BROWN, lineHeight: 1.1, margin: "0 0 0" }}>
              Aquí tu forma<br />de ser tiene
            </h1>
            <div style={{ fontFamily: SERIF, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: GOLD, fontStyle: "italic", lineHeight: 1.1, marginBottom: "1rem" }}>
              sentido.
            </div>
            <p style={{ fontSize: "0.88rem", color: BROWN2, lineHeight: 1.7, marginBottom: "1.6rem", maxWidth: 400 }}>
              Acompañamiento, herramientas y recursos para mujeres neurodivergentes (Autismo, TDAH y AuDHD) que quieren comprenderse, cuidarse y vivir con más calma y autenticidad.
            </p>

          </div>

          {/* Right – image collage */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* polaroid frame */}
            {/* polaroid frame - clickable */}
            <a href="/sobre-mi-mama-girasol.html" style={{
              background: "#fff",
              padding: "10px 10px 36px 10px",
              boxShadow: "6px 12px 32px rgba(44,31,14,0.22)",
              transform: "rotate(-2deg)",
              maxWidth: 420, width: "100%",
              position: "relative", zIndex: 2,
              display: "block", textDecoration: "none", color: "inherit",
              cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s"
            }}
            className="hero-polaroid"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "rotate(-2deg) translateY(-4px) scale(1.02)";
              e.currentTarget.style.boxShadow = "6px 16px 40px rgba(44,31,14,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "rotate(-2deg)";
              e.currentTarget.style.boxShadow = "6px 12px 32px rgba(44,31,14,0.22)";
            }}>
              <div style={{ overflow: "hidden", width: "100%", height: 420 }}>
                <img
                  src={`${R}Fergis.jpeg`}
                  alt="Mamá Girasol - acompañamiento neurodivergente"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
                />
              </div>
            </a>

            {/* Sticky note top-right */}
            <div style={{
              position: "absolute", top: -20, right: -10, zIndex: 3,
              background: "#f5e6a3", padding: "10px 12px", width: 130,
              boxShadow: "2px 4px 10px rgba(0,0,0,0.12)", transform: "rotate(3deg)",
              fontFamily: SCRIPT, fontSize: "0.88rem", color: "#5a3e12", lineHeight: 1.4
            }}>
              Si quieres conocerme haz clic en la foto.
            </div>

            {/* Mushroom decor bottom-right */}
            <div style={{ position: "absolute", bottom: -24, right: -20, opacity: 0.7 }}>
              <img src={`${R}icono-brote-semilla.png`} alt="" style={{ width: 72 }} />
            </div>

            {/* Flower decor bottom-left */}
            <div style={{ position: "absolute", bottom: -16, left: -20, opacity: 0.75 }}>
              <img src={`${R}icono-girasoles.png`} alt="" style={{ width: 80 }} />
            </div>
          </div>

        </div>

        {/* ─── FEATURES BAR ─── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 24px" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: BROWN, textAlign: "left", marginBottom: 20, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10 }}>
            ¿Qué encontrarás aquí? <img src={`${R}icono-ramo-etiqueta.png`} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
          </h2>
          <div style={{ display: "flex", justifyContent: "center", background: CREAM, borderRadius: 16, padding: "24px 20px", boxShadow: "0 2px 12px rgba(44,31,14,0.07)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 20, width: "100%", maxWidth: 1060 }} className="features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10 }}>
                  <div style={{ height: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                    <img src={f.img} alt={f.label} style={{ width: f.size || 40, height: f.size || 40, objectFit: "contain" }} />
                  </div>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, color: BROWN, lineHeight: 1.4, whiteSpace: "pre-line", margin: 0, flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* torn bottom */}
        <div style={{ height: 22, background: CREAM2, clipPath: "polygon(0 100%,100% 100%,100% 60%,97% 0,94% 50%,90% 0,87% 40%,83% 0,80% 60%,76% 0,73% 45%,70% 0,66% 55%,62% 0,58% 50%,54% 0,50% 60%,46% 0,42% 45%,38% 0,34% 55%,30% 0,26% 50%,22% 0,18% 60%,14% 0,10% 45%,6% 0,3% 50%,0 0)", marginTop: -1 }} />
      </section>

      {/* ─── CATEGORIES / RINCÓN DE BIENESTAR ─── */}
      <section style={{ background: CREAM2, padding: "30px 24px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 4 }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: BROWN, textAlign: "left", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10, margin: 0 }}>
              Rincón de Bienestar
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }} className="cat-grid">
            {CATEGORIES.map((cat, i) => (
              <a
                key={i}
                href={cat.href || "#"}
                style={{
                  background: CREAM, borderRadius: 12, display: "flex", flexDirection: "column",
                  alignItems: "center", textAlign: "center", padding: "16px 12px",
                  textDecoration: "none", boxShadow: "0 2px 6px rgba(44,31,14,0.05)",
                  border: `1px solid rgba(160,130,90,0.15)`, transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(44,31,14,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(44,31,14,0.05)"; }}
              >
                <p style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "1rem", color: BROWN, marginBottom: 12, lineHeight: 1.2, minHeight: "2.4rem", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>{cat.title}</p>
                <div style={{ height: 130, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  {cat.img2 ? (
                    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                      <img src={cat.img} alt={cat.title} style={{ width: 96, height: 96, objectFit: "contain" }} />
                      <img src={cat.img2} alt={cat.title} style={{ width: 96, height: 96, objectFit: "contain" }} />
                    </div>
                  ) : (
                    <img src={cat.img} alt={cat.title} style={{ width: cat.size ?? 120, height: cat.size ?? 120, objectFit: "contain" }} />
                  )}
                </div>
                <p style={{ fontSize: "0.75rem", color: BROWN3, lineHeight: 1.4, marginTop: "auto" }}>{cat.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LO MÁS ELEGIDO ─── */}
      <section style={{ background: CREAM3, padding: "56px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* heading row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem, 3vw, 2rem)", color: BROWN, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
              Lo más destacado <img src={`${R}icono-helecho.png`} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
            </h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={() => scrollCarousel('left')}
                style={{ background: CREAM, border: `1px solid ${GOLD}`, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: GOLD, transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = CREAM2}
                onMouseLeave={e => e.currentTarget.style.background = CREAM}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                style={{ background: CREAM, border: `1px solid ${GOLD}`, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: GOLD, transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = CREAM2}
                onMouseLeave={e => e.currentTarget.style.background = CREAM}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <style>{`.products-carousel::-webkit-scrollbar { display: none; }`}</style>
          <div ref={carouselRef} style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 20, scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }} className="products-carousel">
            {PRODUCTS.map((p, i) => (
              <a
                key={i}
                href={p.href || "#"}
                style={{
                  minWidth: 200, maxWidth: 220, flex: "0 0 auto", scrollSnapAlign: "start",
                  background: CREAM, borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(44,31,14,0.08)", transition: "transform 0.2s, box-shadow 0.2s", position: "relative", cursor: "pointer", textDecoration: "none", display: "flex", flexDirection: "column"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(44,31,14,0.14)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(44,31,14,0.08)"; }}
              >
                {/* image */}
                <div style={{ aspectRatio: "1 / 1", background: CREAM2, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                {/* badge */}
                {p.badge && (
                  <span style={{ position: "absolute", top: 10, left: 10, background: "#c0392b", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
                    {p.badge}
                  </span>
                )}
                {/* cart icon */}
                <span style={{ position: "absolute", top: 10, right: 10, background: CREAM, border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}>
                  <ShoppingBag size={13} style={{ color: GOLD }} />
                </span>
                {/* info */}
                <div style={{ padding: "10px 12px 12px" }}>
                  <p style={{ fontSize: "0.77rem", fontWeight: 600, color: BROWN, lineHeight: 1.35, marginBottom: 0 }}>{p.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CARTA / SOBRE MÍ / SEMILLITA ─── */}
      <section style={{ background: YELLOW, padding: "56px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }} className="bottom-grid">

          {/* Carta del mes */}
          <div style={{
            background: CREAM, borderRadius: 16,
            boxShadow: "0 4px 20px rgba(0,0,0,0.13)",
            display: "flex", flexDirection: "row", alignItems: "center",
            padding: "28px 24px 28px 28px", gap: 0, position: "relative",
            overflow: "visible", minHeight: 220,
          }}>
            {/* Left: text */}
            <div style={{ flex: 1, paddingRight: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, border: `1.5px solid rgba(100,70,30,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={16} style={{ color: BROWN3 }} />
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: "1.2rem", color: BROWN, fontWeight: 700 }}>Carta del mes</h3>
              </div>
              <p style={{ fontFamily: SCRIPT, fontSize: "1.05rem", color: BROWN, fontWeight: 700, lineHeight: 1.4, marginBottom: 12 }}>
                "Permítete florecer a tu ritmo"
              </p>
              <p style={{ fontSize: "0.78rem", color: BROWN3, lineHeight: 1.7, marginBottom: 18 }}>
                Una carta sobre soltar la prisa y confiar en tu proceso.
              </p>
              <a href="#" style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                color: BROWN, fontWeight: 700,
                textDecoration: "none", fontFamily: SCRIPT, fontSize: "1.05rem"
              }}>
                Leer carta →
              </a>
            </div>

            {/* Right: polaroid photo with clip */}
            <div style={{ flexShrink: 0, position: "relative", width: 150 }}>
              {/* paperclip */}
              <div style={{
                position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)",
                width: 14, height: 32, borderRadius: "7px 7px 0 0",
                border: "2.5px solid #b0a080", borderBottom: "none",
                zIndex: 2, background: "transparent",
              }} />
              <div style={{
                background: "#fff", padding: "8px 8px 24px 8px",
                boxShadow: "3px 6px 18px rgba(0,0,0,0.22)",
                transform: "rotate(2deg)",
              }}>
                <div style={{ width: "100%", height: 155, overflow: "hidden" }}>
                  <img
                    src={`${R}icono-cesta-flores.png`}
                    alt="Carta del mes"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sobre mí */}
          <div style={{
            background: CREAM, borderRadius: 16, overflow: "visible",
            boxShadow: "0 4px 20px rgba(0,0,0,0.13)",
            display: "flex", flexDirection: "row", alignItems: "center",
            padding: "28px 24px 28px 28px", gap: 0, position: "relative",
            minHeight: 220,
          }}>
            {/* tape decoration top */}
            <div style={{
              position: "absolute", top: -10, right: 60,
              width: 50, height: 18, background: "rgba(200,180,130,0.55)",
              borderRadius: 3, transform: "rotate(-2deg)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }} />

            {/* Left: text */}
            <div style={{ flex: 1, paddingRight: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <img src={`${R}icono-ramo-etiqueta.png`} alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
                <h3 style={{ fontFamily: SERIF, fontSize: "1.3rem", color: BROWN, fontWeight: 700 }}>Clases de inglés con Papá Girasol</h3>
              </div>
              <p style={{ fontSize: "0.92rem", color: BROWN, fontWeight: 700, marginBottom: 10 }}>Aprende a tu ritmo, sin presión 🌻</p>
              <p style={{ fontSize: "0.8rem", color: BROWN3, lineHeight: 1.7, marginBottom: 16 }}>
                Con Papá Girasol: clases tranquilas, flexibles y respetuosas con cada manera de aprender. Para cerebritos diferentes que quieren sentirse cómodos con el idioma.
              </p>
              <a href="/clases-de-ingles.html" style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                color: GOLD, fontWeight: 700,
                textDecoration: "none", fontFamily: SCRIPT, fontSize: "1.05rem"
              }}>
                Ver las clases →
              </a>
            </div>

            {/* Right: polaroid photo */}
            <div style={{
              flexShrink: 0, width: 160,
              background: "#fff",
              padding: "8px 8px 24px 8px",
              boxShadow: "3px 6px 18px rgba(0,0,0,0.18)",
              transform: "rotate(3deg)",
              marginRight: -10,
            }}>
              <div style={{ width: "100%", height: 160, overflow: "hidden" }}>
                <img
                  src={`${R}papa-girasol.jpg`}
                  alt="Papá Girasol"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
                />
              </div>
            </div>
          </div>

          {/* El Campo de Flores */}
          <div style={{ background: CREAM2, borderRadius: 16, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src={`${R}icono-brote-semilla.png`} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
              <h3 style={{ fontFamily: SERIF, fontSize: "1.15rem", color: BROWN, fontWeight: 700 }}>El Campo de Flores</h3>
            </div>
            <p style={{ fontSize: "0.8rem", color: BROWN2, lineHeight: 1.65 }}>
              El Campo de Flores es un jardín digital que crece con cada persona que decide acompañar este proyecto. 🌱<br />
              Planta tu semillita y ayúdanos a seguir floreciendo.
            </p>
            <a
              href="/campo"
              style={{
                display: "block", textAlign: "center", width: "100%", padding: "11px",
                borderRadius: 24, background: YELLOW, color: BROWN, fontWeight: 700,
                fontSize: "0.85rem", textDecoration: "none", marginTop: "auto",
                transition: "opacity 0.2s"
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Visitar el Campo de Flores 🌻
            </a>
          </div>

        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: YELLOW2, padding: "48px 24px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 32, paddingBottom: 36, borderBottom: "1px solid rgba(255,255,255,0.1)" }} className="footer-grid">

            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <img src={`${R}icono-girasoles.png`} alt="Logo" style={{ width: 44, height: 44, objectFit: "contain" }} />
                <div>
                  <div style={{ fontFamily: SCRIPT, fontSize: "1.3rem", color: BROWN, fontWeight: 700, lineHeight: 1 }}>Mamá</div>
                  <div style={{ fontFamily: SCRIPT, fontSize: "1.3rem", color: BROWN, fontWeight: 700, lineHeight: 1 }}>Girasol</div>
                </div>
              </div>
              <p style={{ fontSize: "0.76rem", color: BROWN2, lineHeight: 1.7, marginBottom: 14 }}>
                Acompañamiento y recursos para mujeres neurodivergentes (Autismo, TDAH y AuDHD).
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { icon: Instagram, url: "https://www.instagram.com/fergismarrero/" },
                  { icon: Music2, url: "https://www.tiktok.com/@fergismarrero" },
                  { icon: Youtube, url: "https://www.youtube.com/@fergismarrero" },
                  { icon: Pinterest, url: "https://www.pinterest.com/fergismarrero/" },
                  { icon: Linkedin, url: "https://www.linkedin.com/in/fergismarrero/" },
                ].map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: "50%", background: YELLOW, display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                    <s.icon size={15} style={{ color: BROWN }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Navega */}
            <div>
              <h4 style={{ color: BROWN, fontSize: "0.85rem", fontWeight: 700, marginBottom: 14 }}>Navega</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {NAV_LINKS.map(link => (
                  <li key={link.label}><a href={link.href} style={{ fontSize: "0.77rem", color: BROWN2, textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = BROWN)}
                    onMouseLeave={e => (e.currentTarget.style.color = BROWN2)}>{link.label}</a></li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 style={{ color: BROWN, fontSize: "0.85rem", fontWeight: 700, marginBottom: 14 }}>Legal</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Aviso legal", href: "#" },
                  { label: "Política de privacidad", href: "#" },
                  { label: "Términos y condiciones", href: "#" },
                  { label: "Libro de reclamaciones", href: "#" },
                  { label: "Testimonios", href: "#" },
                ].map(link => (
                  <li key={link.label}><a href={link.href} style={{ fontSize: "0.77rem", color: BROWN2, textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = BROWN)}
                    onMouseLeave={e => (e.currentTarget.style.color = BROWN2)}>{link.label}</a></li>
                ))}
              </ul>
            </div>

            {/* Medios de pago */}
            <div>
              <h4 style={{ color: BROWN, fontSize: "0.85rem", fontWeight: 700, marginBottom: 14 }}>Medios de pago</h4>
              <p style={{ fontSize: "0.73rem", color: BROWN2, marginBottom: 8 }}>Perú</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                <img src={`${R}pago-yape.png`} alt="Yape" style={{ height: 64, objectFit: "contain" }} />
                <img src={`${R}pago-plin.png`} alt="Plin" style={{ height: 64, objectFit: "contain" }} />
                <img src={`${R}pago-banco.png`} alt="Banco / Depósito" style={{ height: 64, objectFit: "contain" }} />
              </div>
              <p style={{ fontSize: "0.73rem", color: BROWN2, marginBottom: 6 }}>Internacional</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <img src={`${R}pago-paypal.png`} alt="PayPal" style={{ height: 64, objectFit: "contain" }} />
                <img src={`${R}tarjeta de débito.png`} alt="Tarjeta" style={{ height: 64, objectFit: "contain" }} />
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ paddingTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: "0.72rem", color: BROWN3 }}>© 2024 Mamá Girasol. Todos los derechos reservados. 🌻</p>
            <p style={{ fontSize: "0.72rem", color: BROWN3 }}>Hecho con amor para ti.</p>
          </div>
        </div>
      </footer>

      {/* ─── RESPONSIVE STYLES ─── */}
      <style>{`
        @media (max-width: 1024px) {
          .hidden-mobile { display: none !important; }
          .hamburger     { display: flex !important; }
          .hero-grid     { grid-template-columns: 1fr !important; }
          .cat-grid      { grid-template-columns: repeat(3, 1fr) !important; }
          .products-carousel { gap: 12px !important; }
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bottom-grid   { grid-template-columns: 1fr !important; }
          .footer-grid   { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .cat-grid      { grid-template-columns: repeat(2, 1fr) !important; }
          .footer-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ─── MODALS ─── */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showAccountModal && user && <AccountModal user={user} onClose={() => setShowAccountModal(false)} />}

    </div>
  );
}
