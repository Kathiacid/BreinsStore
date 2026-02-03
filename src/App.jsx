import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './assets/components/ScrollToTop'; // ✅ Importado correctamente

// Importa tus componentes
import Navbar from './assets/components/navbar';
import Home from './assets/pages/home';
import Cart from './assets/components/cart'; 

function App() {
  // --- 3. ESTADOS GLOBALES (El cerebro del carrito) ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // --- 4. FUNCIONES DEL CARRITO ---
  
  // Abrir/Cerrar
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Agregar producto
  const addToCart = (productName, priceString, img) => {
    // Limpieza de precio: Convierte "$200.000" -> 200000 (número)
    let priceNumber = priceString;
    if (typeof priceString === 'string') {
        priceNumber = parseInt(priceString.replace(/\D/g, '')) || 0;
    }

    const newItem = {
      id: Date.now(), // Generamos un ID único temporal
      name: productName,
      price: priceNumber,
      img: img
    };

    setCartItems([...cartItems, newItem]); // Agregamos a la lista
    setIsCartOpen(true); // Abrimos el carrito para mostrar el producto añadido
  };

  // Eliminar producto
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <Router>
      {/* ✅ AQUÍ SE IMPLEMENTA EL SCROLL TO TOP */}
      {/* Se ejecutará en cada cambio de ruta para subir la pantalla */}
      <ScrollToTop />

      {/* 5. NAVBAR CONECTADO */}
      <Navbar 
        onCartClick={toggleCart} 
        cartCount={cartItems.length} 
      />

      {/* 6. COMPONENTE CARRITO */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
      />

      <main>
        <Routes>
          {/* 7. HOME CONECTADO */}
          <Route path="/" element={<Home onAddProduct={addToCart} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;