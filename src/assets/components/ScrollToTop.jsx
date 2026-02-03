import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Hace scroll suave hacia arriba (0, 0) cada vez que cambia la ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Usa "smooth" si quieres animación, "instant" es mejor para UX rápida
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;