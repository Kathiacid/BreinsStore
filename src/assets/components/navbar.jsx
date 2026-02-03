import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom'; 
import './navbar.css'; 

const Navbar = ({ onCartClick, cartCount }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Función auxiliar para cerrar menú
    const closeMenu = () => setIsOpen(false);

    // ✅ Función unificada: Cierra menú + Scroll al top
    const handleHomeClick = () => {
        closeMenu(); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <nav className="navbar">
            {/* 1. LOGO (Ahora con scroll to top) */}
            <div className="nav-logo">
                <Link to="/" onClick={handleHomeClick}>
                    <span className="logo-bold">BREINS</span>
                    <span className="logo-light">STORE</span>
                </Link>
            </div>

            {/* 2. LINKS CENTRALES */}
            <ul className={`nav-menu ${isOpen ? "open" : ""}`}>
                <li>
                    {/* INICIO (Con scroll to top) */}
                    <Link to="/" onClick={handleHomeClick}>
                        INICIO
                    </Link>
                </li>
                <li>
                    <Link to="/?category=shoes" onClick={closeMenu}>
                        ZAPATOS
                    </Link>
                </li>
                <li>
                    <Link to="/?category=clothing" onClick={closeMenu}>
                        ROPA
                    </Link>
                </li>
                <li>
                    <Link to="/?category=sale" className="link-ofertas" onClick={closeMenu}>
                        OFERTAS
                    </Link>
                </li>
            </ul>

            {/* 3. ICONOS Y BUSCADOR */}
            <div className="nav-actions">
                <div className="search-box">
                    <input type="text" placeholder="Buscar..." className="search-input" />
                    <span className="material-symbols-outlined icon">search</span>
                </div>
                
                <div 
                    className="nav-icon-link" 
                    onClick={onCartClick} 
                    style={{ cursor: 'pointer' }}
                >
                    <span className="material-symbols-outlined icon">shopping_cart</span>
                    {cartCount > 0 && (
                        <span className="cart-count">{cartCount}</span>
                    )}
                </div>
            </div>

            {/* Menú hamburguesa */}
            <div className={`nav-toggle ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    );
};

export default Navbar;