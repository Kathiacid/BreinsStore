import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./assets/components/ScrollToTop";
import NotFound from './assets/pages/NotFound'
import Navbar from "./assets/components/navbar";
import Home from "./assets/pages/home";
import Cart from "./assets/components/cart";

function App() {
  // ESTADOS GLOBALES
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Abrir/Cerrar carrito
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  /**
   * ✅ NUEVO addToCart
   * Recibe objeto desde Home:
   * { id, name, img, price (number), originalPrice (number) }
   */
  const addToCart = (product) => {
    if (!product) return;

    const newItem = {
      // ✅ usa el id real del producto si viene
      id: product.id ?? Date.now(),
      name: product.name ?? "Producto",
      img: product.img ?? "",
      price: Number(product.price || 0),
      originalPrice: Number(product.originalPrice || 0),
    };

    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  // Eliminar producto
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Router>
      <ScrollToTop />

      <Navbar onCartClick={toggleCart} cartCount={cartItems.length} />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
      />

      <main>
        <Routes>
          <Route path="/" element={<Home onAddProduct={addToCart} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
