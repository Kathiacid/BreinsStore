import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../../utils/shopify"; // ✅ Importamos getCart
import "./navbar.css";

const Navbar = ({ onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0); // ✅ Inicializamos en 0

  const navigate = useNavigate();
  const closeMenu = () => setIsOpen(false);

  /* =========================
      ACTUALIZAR CONTADOR REAL
  ========================= */
  const updateBadgeCount = async () => {
    try {
      const cart = await getCart();
      if (cart) {
        setCartCount(cart.totalQuantity || 0);
      }
    } catch (error) {
      console.error("Error al actualizar contador del navbar:", error);
    }
  };

  useEffect(() => {
    // 1. Cargar cantidad inicial al montar
    updateBadgeCount();

    // 2. Escuchar el evento personalizado que disparamos en shopify.js
    window.addEventListener("cartUpdated", updateBadgeCount);

    return () => {
      window.removeEventListener("cartUpdated", updateBadgeCount);
    };
  }, []);

  /* =========================
      BUSCADOR
  ========================= */
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      closeMenu();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link
          to="/"
          onClick={() => {
            setSearchTerm("");
            closeMenu();
          }}
        >
          <span className="logo-bold">BREINS</span>
          <span className="logo-light">STORE</span>
        </Link>
      </div>

      <ul className={`nav-menu ${isOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={closeMenu}>INICIO</Link></li>
        <li><Link to="/?category=shoes" onClick={closeMenu}>ZAPATOS</Link></li>
        <li><Link to="/?category=clothing" onClick={closeMenu}>ROPA</Link></li>
        <li>
          <Link
            to="/?category=sale"
            className="link-ofertas"
            onClick={closeMenu}
          >
            OFERTAS
          </Link>
        </li>
      </ul>

      <div className="nav-actions">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <span
            className="material-symbols-outlined icon"
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          >
            search
          </span>
        </div>

        {/* ✅ Icono del Carrito con el Badge Corregido */}
        <div
          className="nav-icon-link"
          onClick={onCartClick}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <span className="material-symbols-outlined icon">
            shopping_cart
          </span>

          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}
        </div>
      </div>

      <div
        className={`nav-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;