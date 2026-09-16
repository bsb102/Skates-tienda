// Archivo: src/App.tsx (Ejemplo de estructura)
import { useState } from 'react';
// ... importaciones de tu librería de autenticación si las tienes ...
import './App.css';

function App() {
  // Supongamos que tienes un estado de autenticación (luego lo integras)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    // Lógica de redirección o apertura del modal de Cognito
    console.log("Redirigiendo a Cognito...");
    // Para probar el cambio de estado visual, descomenta la siguiente línea:
    // setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    // ESTA ES LA VISTA DEL CATÁLOGO (QUE AÚN NO ME HAS MOSTRADO)
    return (
      <div className="catalog-view">
        <h1>Catálogo de Skates (Pronto)</h1>
        {/* Aquí iría tu grilla de productos cuando la tengas */}
      </div>
    );
  }

  // ESTA ES LA VISTA DE LOGIN (LA QUE VEMOS AHORA)
  // TRANSFORMADA EN UN HERO SECTION PROFESIONAL
  return (
    <div className="app-container">
      {/* Barra de navegación superior (Similar a la referencia) */}
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
          <button className="btn-login" onClick={handleLogin}>
            Iniciar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Principal: El Hero Section Urbano */}
      <main className="hero-section">
        <div className="hero-content">
          {/* Puedes agregar un mensaje de marketing aquí */}
          <div className="hero-tagline">
            <h2>¡Pasión por el asfalto!</h2>
            <p>Autentica tu cuenta para acceder al mejor material.</p>
          </div>
          
          {/* Tu botón actual de logueo, pero más estilizado */}
          <div className="login-prompt">
            <button className="btn-action-large" onClick={handleLogin}>
              Iniciar sesión como cliente
            </button>
            <p className="login-subtext">Accede a tu cuenta para ver el catálogo completo y ofertas exclusivas.</p>
          </div>
        </div>
      </main>

      {/* Footer opcional */}
      <footer className="store-footer">
        <p>© 2023 Skate — Tienda. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;