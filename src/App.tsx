import { useEffect, useMemo, useState } from "react";
import { obtenerCatalogo, type Skate } from "./api";
import { cerrarSesion, iniciarSesion } from "./auth";
import "./App.css";

function App() {
  const [skates, setSkates] = useState<Skate[]>([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [autenticado, setAutenticado] = useState(() => Boolean(localStorage.getItem("skates-token")));
  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  // Estado para alternar entre el Hero Section y el formulario de login de clientes
  const [mostrandoLogin, setMostrandoLogin] = useState(false);

  useEffect(() => {
    if (!autenticado) return;
    obtenerCatalogo()
      .then(setSkates)
      .catch(() => setError("No se pudo cargar el catálogo. Verifica que el backend esté ejecutándose."))
      .finally(() => setCargando(false));
  }, [autenticado]);

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    iniciarSesion(usuario, clave)
      .then(() => setAutenticado(true))
      .catch(() => setErrorLogin("Credenciales inválidas"));
  };

  // 1. VISTA DEL FORMULARIO DE ACCESO DE CLIENTES
  if (!autenticado && mostrandoLogin) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', backgroundColor: '#090a0f', color: '#94a3b8' }}>
        <form 
          onSubmit={handleLoginSubmit} 
          style={{ width: 'min(420px, 90vw)', padding: '40px', backgroundColor: '#13151a', borderRadius: '14px', border: '1px solid rgba(249, 115, 22, 0.4)', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(249, 115, 22, 0.1)', boxSizing: 'border-box', position: 'relative' }}
        >
          {/* Botón de volver estilizado */}
          <button 
            type="button" 
            onClick={() => setMostrandoLogin(false)}
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px', 
              background: 'transparent', 
              border: '1px solid #27272a', 
              borderRadius: '6px',
              color: '#94a3b8', 
              cursor: 'pointer', 
              fontSize: '11px', 
              fontWeight: 700,
              padding: '6px 12px',
              letterSpacing: '1px',
              boxShadow: 'none',
              textTransform: 'uppercase'
            }}
          >
            ← Volver
          </button>

          <p className="eyebrow accent" style={{ marginBottom: '8px' }}>SKATE SHOP LOCAL</p>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', color: '#ffffff', letterSpacing: '-1px' }}>Acceso de clientes</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>Inicia sesión para consultar el catálogo.</p>
          
          <div style={{ marginBottom: '14px' }}>
            <input 
              value={usuario} 
              onChange={(event) => setUsuario(event.target.value)} 
              placeholder="Usuario" 
              style={{ display: 'block', width: '100%', padding: '12px 14px', boxSizing: 'border-box', backgroundColor: '#090a0f', border: '1px solid #27272a', borderRadius: '6px', color: '#ffffff', fontSize: '14px', outline: 'none' }} 
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input 
              type="password" 
              value={clave} 
              onChange={(event) => setClave(event.target.value)} 
              placeholder="Contraseña" 
              style={{ display: 'block', width: '100%', padding: '12px 14px', boxSizing: 'border-box', backgroundColor: '#090a0f', border: '1px solid #27272a', borderRadius: '6px', color: '#ffffff', fontSize: '14px', outline: 'none' }} 
            />
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '12px', backgroundColor: '#f97316', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.2px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)', marginBottom: '16px' }}
          >
            Entrar
          </button>

          {errorLogin && <p className="error-message" style={{ textAlign: 'center', marginBottom: '12px' }}>{errorLogin}</p>}
          
          <small style={{ color: '#94a3b8', opacity: 0.6, fontSize: '12px', display: 'block', textAlign: 'center', letterSpacing: '0.3px' }}>Demo local: cliente / cliente123</small>
        </form>
      </main>
    );
  }

  // 2. VISTA PRINCIPAL (HERO SECTION URBANO)
  if (!autenticado && !mostrandoLogin) {
    return (
      <div className="app-container">
        <header className="store-header">
          <div className="logo-container">
            <h1 className="app-logo">Skate — Tienda</h1>
          </div>
          <nav className="header-nav">
            <span>Tablas</span>
            <span>Ruedas</span>
            <span>Accesorios</span>
          </nav>
          <div className="user-actions">
            <button className="btn-login" onClick={() => setMostrandoLogin(true)}>
              Iniciar Sesión
            </button>
          </div>
        </header>

        <main className="hero-section">
          <div className="hero-content">
            <div className="hero-tagline">
              <h2>¡Pasión por el asfalto!</h2>
              <p>Autentica tu cuenta para acceder al mejor material.</p>
            </div>
            
            <div className="login-prompt">
              <button className="btn-action-large" onClick={() => setMostrandoLogin(true)} style={{ cursor: 'pointer' }}>
                Iniciar sesión como cliente
              </button>
              <p className="login-subtext">Accede a tu cuenta para ver el catálogo completo y ofertas exclusivas.</p>
            </div>
          </div>
        </main>

        <footer className="store-footer">
          <p>© 2026 Skate — Tienda. Todos los derechos reservados.</p>
        </footer>
      </div>
    );
  }

  // 3. VISTA DEL CATÁLOGO (AUTENTICADO)
  const modelos = useMemo(
    () => ["Todos", ...Array.from(new Set(skates.map((skate) => skate.modelo)))],
    [skates],
  );

  const skatesFiltrados = modeloSeleccionado === "Todos"
    ? skates
    : skates.filter((skate) => skate.modelo === modeloSeleccionado);

  return (
    <div className="app-container">
      <header className="store-header">
        <div className="logo-container">
          <p className="eyebrow">SKATE SHOP / 2026</p>
          <h1 className="app-logo">Skate - Tienda</h1>
        </div>
        <div className="catalog-counter">
          <strong>{skates.length}</strong>
          <span>tablas disponibles</span>
          <button type="button" onClick={() => { cerrarSesion(); setAutenticado(false); setMostrandoLogin(false); }}>Salir</button>
        </div>
      </header>

      <main className="catalog-main">
        <section className="catalog-intro">
          <div>
            <p className="eyebrow accent">CATALOGO EN VIVO</p>
            <h2>Encuentra tu próxima línea.</h2>
            <p className="intro-copy">Productos cargados desde el inventario del backend.</p>
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
        </section>

        {cargando && <p className="status-message">Cargando inventario...</p>}
        {error && <p className="status-message error-message">{error}</p>}
        {!cargando && !error && skatesFiltrados.length === 0 && (
          <p className="status-message">No hay productos para este filtro.</p>
        )}

        {!cargando && !error && skatesFiltrados.length > 0 && (
          <section className="product-grid" aria-label="Catálogo de productos">
            {skatesFiltrados.map((skate) => (
              <article className="product-card" key={skate.id}>
                <div className="product-number">#{String(skate.id).padStart(2, "0")}</div>
                <div className="product-mark">SK</div>
                <p className="product-model">{skate.modelo}</p>
                <h3>{skate.marca}</h3>
                <div className="product-details">
                  <span>{skate.medida ? `${skate.medida}"` : `Wheelbase ${skate.wheelbase}"`}</span>
                  <span>{skate.stock} en stock</span>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <footer className="store-footer">Inventario conectado a Skates Backend</footer>
    </div>
  );
}

export default App;