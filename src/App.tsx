import { useEffect, useMemo, useState } from "react";
import { obtenerCatalogo, type Skate } from "./api";
import { cerrarSesion, iniciarSesion } from "./auth";
import "./App.css";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1723236900134-63561e5832b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2thdGVib2FyZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
    tag: "NUEVA COLECCIÓN 2026",
    title: "DOMINA EL ASFALTO.",
    description: "Diseño, resistencia y máxima pop. Selecciona tu estilo de tabla ideal y arma tu setup perfecto.",
    details: ["Madera de alta resistencia", "Pop consistente", "Setup listo para calle"]
  },
  {
    image: "https://images.unsplash.com/photo-1591311337241-cecfd26f1da1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNrYXRlYm9hcmRpbmd8ZW58MHx8MHx8fDA%3D",
    tag: "ESTILO URBAN STREET",
    title: "TRUCOS SIN LÍMITES.",
    description: "Tablas construidas con madera de alta durabilidad preparadas para soportar el castigo diario de la calle.",
    details: ["Control en cada truco", "Diseño para street", "Respuesta estable"]
  },
  {
    image: "https://images.unsplash.com/photo-1589542425426-2460d8243b58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHNrYXRlYm9hcmRpbmd8ZW58MHx8MHx8fDA%3D",
    tag: "ALTO RENDIMIENTO",
    title: "TECNOLOGÍA Y CONTROL.",
    description: "Geometrías optimizadas para un mejor pop, mayor estabilidad en rampa y un control absoluto en cada descenso.",
    details: ["Estabilidad en rampa", "Giro preciso", "Construcción durable"]
  }
];

function App() {
  // 1. TODOS LOS HOOKS DECLARADOS AL INICIO (Sin saltos ni retornos previos)
  const [skates, setSkates] = useState<Skate[]>([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [autenticado, setAutenticado] = useState(() => Boolean(localStorage.getItem("skates-token")));
  const [errorLogin, setErrorLogin] = useState<string | null>(null);
  const [mostrandoLogin, setMostrandoLogin] = useState(false);
  const [bannerActual, setBannerActual] = useState(0);
  const [carrito, setCarrito] = useState<Skate[]>([]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerActual((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    obtenerCatalogo()
      .then((data) => {
        setSkates(data);
        setError(null);
      })
      .catch(() => {
        setError("No se pudo cargar el catálogo. Verifica que el backend esté ejecutándose.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    iniciarSesion(usuario, clave)
      .then(() => {
        setAutenticado(true);
        setMostrandoLogin(false);
        setErrorLogin(null);
      })
      .catch(() => setErrorLogin("Credenciales inválidas"));
  };

  const modelos = useMemo(
    () => ["Todos", ...Array.from(new Set(skates.map((skate) => skate.modelo)))],
    [skates],
  );

  const skatesFiltrados = modeloSeleccionado === "Todos"
    ? skates
    : skates.filter((skate) => skate.modelo === modeloSeleccionado);

  const slideActual = SLIDES[bannerActual];

  const agregarAlCarrito = (skate: Skate) => {
    if (!autenticado) {
      setMostrandoLogin(true);
      return;
    }

    setCarrito((actual) => actual.some((item) => item.id === skate.id)
      ? actual
      : [...actual, skate]);
  };

  return (
    <div className="app-container">
      {/* Modal de Inicio de Sesión superpuesto de forma limpia */}
      {mostrandoLogin && !autenticado && (
        <div className="login-overlay">
          <form onSubmit={handleLoginSubmit} className="login-card">
            <button 
              type="button" 
              onClick={() => setMostrandoLogin(false)}
              className="login-close-btn"
            >
              ← Volver
            </button>

            <p className="eyebrow accent" style={{ marginBottom: '8px' }}>SKATE SHOP LOCAL</p>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: '#ffffff', margin: '0 0 8px 0' }}>Acceso de clientes</h1>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', marginTop: 0 }}>Inicia sesión para gestionar tu cuenta.</p>
            
            <div style={{ marginBottom: '14px' }}>
              <input 
                value={usuario} 
                onChange={(e) => setUsuario(e.target.value)} 
                placeholder="Usuario" 
                className="login-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input 
                type="password" 
                value={clave} 
                onChange={(e) => setClave(e.target.value)} 
                placeholder="Contraseña" 
                className="login-input"
              />
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', backgroundColor: '#f97316', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1.2px' }}
            >
              Entrar
            </button>

            {errorLogin && <p className="error-message" style={{ textAlign: 'center', marginBottom: '12px' }}>{errorLogin}</p>}
            <small style={{ color: '#94a3b8', opacity: 0.6, fontSize: '12px', display: 'block', textAlign: 'center' }}>Demo local: cliente / cliente123</small>
          </form>
        </div>
      )}

      {/* Header */}
      <header className="store-header">
        <div className="logo-container">
          <span style={{ color: '#f97316', fontWeight: 800, fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>Urban Store</span>
          <h1 className="app-logo">Skate — Tienda</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="catalog-counter" style={{ alignItems: 'flex-end' }}>
            <strong>{skates.length}</strong>
            <span style={{ fontSize: '10px', opacity: 0.7 }}>Disponibles</span>
          </div>
          
          {autenticado ? (
            <button 
              type="button" 
              onClick={() => { cerrarSesion(); setAutenticado(false); setCarrito([]); }}
              style={{ fontSize: '11px', padding: '8px 16px', background: 'transparent', border: '1px solid #27272a', color: '#94a3b8', borderRadius: '8px', cursor: 'pointer', textTransform: 'uppercase' }}
            >
              Salir
            </button>
          ) : (
            <button 
              type="button" 
              onClick={() => setMostrandoLogin(true)}
              style={{ fontSize: '11px', padding: '10px 20px', background: '#f97316', border: 'none', color: '#fff', fontWeight: 700, borderRadius: '8px', cursor: 'pointer', textTransform: 'uppercase' }}
            >
              Iniciar Sesión
            </button>
          )}
          <div className="cart-summary" aria-label="Carrito de compra">
            <span className="cart-icon" aria-hidden="true">+</span>
            <span>Carrito</span>
            <strong>{carrito.length}</strong>
          </div>
        </div>
      </header>

      {/* Carrusel Dinámico Superior */}
      <section style={{ position: 'relative', width: '100%', height: '380px', overflow: 'hidden', backgroundColor: '#090a0f', borderBottom: '1px solid #27272a' }}>
        {SLIDES.map((slide, index) => (
          <div
            key={slide.image}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(90deg, rgba(9,10,15,0.96) 15%, rgba(9,10,15,0.5) 75%), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: bannerActual === index ? 1 : 0,
              visibility: bannerActual === index ? 'visible' : 'hidden',
              transition: 'opacity 0.8s ease-in-out, visibility 0.8s ease-in-out',
            }}
          />
        ))}

        <div className="hero-copy" style={{ position: 'relative', zIndex: 2, width: 'min(1240px, 100% - 64px)', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ color: '#f97316', fontSize: '12px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>
            {slideActual.tag}
          </span>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, margin: '8px 0 12px', letterSpacing: '-1.5px' }}>
            {slideActual.title}
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '15px', maxWidth: '620px', margin: 0, lineHeight: 1.55 }}>
            {slideActual.description}
          </p>

          <div className="hero-details" aria-label="Características de la colección">
            {slideActual.details.map((detail) => (
              <span key={detail}>{detail}</span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '22px' }}>
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setBannerActual(idx)}
                style={{
                  width: bannerActual === idx ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: bannerActual === idx ? '#f97316' : '#27272a',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Filtros */}
      <section style={{ width: 'min(1240px, 100%)', margin: '40px auto 0', padding: '0 32px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid #27272a', paddingBottom: '24px' }}>
          <div>
            <p className="eyebrow accent">INVENTARIO EN VIVO</p>
            <h3 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, margin: 0 }}>Catálogo de Tablas</h3>
          </div>
          
          <div className="model-filters" aria-label="Filtrar por modelo">
            {modelos.map((modelo) => (
              <button
                className={modelo === modeloSeleccionado ? "filter-button active" : "filter-button"}
                key={modelo}
                onClick={() => setModeloSeleccionado(modelo)}
                type="button"
              >
                {modelo}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de Productos */}
      <main className="catalog-main" style={{ paddingTop: '30px' }}>
        {cargando && <p className="status-message">Cargando tablas y componentes...</p>}
        {error && <p className="status-message error-message">{error}</p>}
        
        {!cargando && !error && skatesFiltrados.length === 0 && (
          <p className="status-message">No hay productos disponibles para este filtro.</p>
        )}

        {!cargando && !error && skatesFiltrados.length > 0 && (
          <section className="product-grid" aria-label="Catálogo de productos">
            {skatesFiltrados.map((skate) => (
              <article className="product-card" key={skate.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="product-number">#{String(skate.id).padStart(2, "0")}</div>
                  <div className="product-mark">SK</div>
                  <p className="product-model">{skate.modelo}</p>
                  <h3>{skate.marca}</h3>
                </div>

                <div className="product-details" style={{ marginTop: '24px' }}>
                  <span>{skate.medida ? `${skate.medida}"` : `WB ${skate.wheelbase}"`}</span>
                  <span>{skate.stock} en stock</span>
                </div>

                <button
                  type="button"
                  className="cart-button"
                  disabled={!autenticado || carrito.some((item) => item.id === skate.id)}
                  onClick={() => agregarAlCarrito(skate)}
                  title={autenticado ? "Agregar esta tabla al carrito" : "Inicia sesión para agregar productos"}
                >
                  {!autenticado
                    ? "Inicia sesión para comprar"
                    : carrito.some((item) => item.id === skate.id)
                      ? "Agregado al carrito"
                      : "Agregar al carrito"}
                </button>
              </article>
            ))}
          </section>
        )}
      </main>

      <footer className="store-footer">
        Skate Shop — Todos los derechos reservados © 2026
      </footer>
    </div>
  );
}

export default App;