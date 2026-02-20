import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ScrollToTop from "./assets/components/ScrollToTop";
import NotFound from "./assets/pages/NotFound";
import Navbar from "./assets/components/navbar";
import Home from "./assets/pages/home";
import Cart from "./assets/components/cart";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const closeCart = () => setIsCartOpen(false);

  // ✅ Escuchar evento global para abrir el carrito automáticamente
  useEffect(() => {
    const handleAutoOpen = () => setIsCartOpen(true);
    window.addEventListener("openCart", handleAutoOpen);
    return () => window.removeEventListener("openCart", handleAutoOpen);
  }, []);

  return (
    <Router>
      <ScrollToTop />

      <Navbar onCartClick={toggleCart} />

      <Cart
        isOpen={isCartOpen}
        onClose={closeCart}
      />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;