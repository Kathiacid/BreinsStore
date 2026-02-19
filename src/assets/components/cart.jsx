import React, { useEffect, useState } from "react";

const Cart = ({ isOpen, onClose }) => {
const [cartItems, setCartItems] = useState(() => {
  return JSON.parse(localStorage.getItem("cart")) || [];
});

  // Cargar carrito desde localStorage
  

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cartItems]);

  if (!isOpen) return null;

  const updateQuantity = (id, amount) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
        : item
    );

    setCartItems(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div style={overlayStyle}>
      <div style={cartStyle}>
        <button onClick={onClose} style={closeBtn}>
          ✕
        </button>

        <h2>Tu carrito 🛒</h2>

        {cartItems.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} style={itemStyle}>
                <img src={item.image} alt={item.title} width={60} />

                <div style={{ flex: 1 }}>
                  <p>{item.title}</p>
                  <p>${item.price}</p>

                  <div style={qtyContainer}>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    style={removeBtn}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <hr />

            <h3>Total: ${total.toFixed(2)}</h3>

            <button style={checkoutBtn}>
              Finalizar compra
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;

/* ========================= */
/* ESTILOS */
/* ========================= */

const overlayStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 1000,
};

const cartStyle = {
  width: "400px",
  background: "white",
  height: "100%",
  padding: "20px",
  overflowY: "auto",
};

const closeBtn = {
  border: "none",
  background: "transparent",
  fontSize: "20px",
  cursor: "pointer",
  float: "right",
};

const itemStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "15px",
  alignItems: "center",
};

const qtyContainer = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "5px",
};

const removeBtn = {
  marginTop: "5px",
  background: "none",
  border: "none",
  color: "red",
  cursor: "pointer",
};

const checkoutBtn = {
  display: "block",
  marginTop: "20px",
  padding: "10px",
  textAlign: "center",
  backgroundColor: "black",
  color: "white",
  border: "none",
  cursor: "pointer",
};