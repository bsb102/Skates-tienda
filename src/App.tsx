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

  useEffect(() => {
    if (!autenticado) return;
    obtenerCatalogo()
      .then(setSkates)
      .catch(() => setError("No se pudo cargar el catálogo. Verifica que el backend esté ejecutándose."))
      .finally(() => setCargando(false));
  }, [autenticado]);

  if (!autenticado) {
    return (
      <main className="login-screen">
        <section className="login-panel">
          <p className="eyebrow accent">SKATE SHOP LOCAL</p>
          <h1>Acceso de clientes</h1>
          <p>Inicia sesión para consultar el catálogo.</p>
          <form onSubmit={(event) => { event.preventDefault(); iniciarSesion(usuario, clave).then(() => setAutenticado(true)).catch(() => setErrorLogin("Credenciales inválidas")); }}>
            <input value={usuario} onChange={(event) => setUsuario(event.target.value)} placeholder="Usuario" />
            <input type="password" value={clave} onChange={(event) => setClave(event.target.value)} placeholder="Contraseña" />
            <button type="submit">Entrar</button>
          </form>
          {errorLogin && <p className="error-message">{errorLogin}</p>}
          <small>Demo local: cliente / cliente123</small>
        </section>
      </main>
    );
  }

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
          <button type="button" onClick={() => { cerrarSesion(); setAutenticado(false); }}>Salir</button>
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
