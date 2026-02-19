import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Si hay parámetros de búsqueda (incluyendo category=all), no subimos al inicio
    // para dejar que Home.jsx haga el scroll al catálogo.
    if (pathname === "/" && search) {
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;