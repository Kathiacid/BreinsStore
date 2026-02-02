import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom'; // Agregamos 'Link' aquí
import './navbar.css'; 

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            {/* 1. LOGO - Usamos Link porque el logo no necesita estado "activo" */}
            <div className="nav-logo">
                <Link to="/">
                    <span className="logo-bold">BREINS</span>
                    <span className="logo-light">STORE</span>
                </Link>
            </div>

            {/* 2. LINKS CENTRALES - Usamos NavLink para detectar la página actual */}
            <ul className={`nav-menu ${isOpen ? "open" : ""}`}>
                <li>
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => isActive ? "active-link" : ""} 
                        onClick={() => setIsOpen(false)}
                    >
                        INICIO
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/zapatos" 
                        className={({ isActive }) => isActive ? "active-link" : ""} 
                        onClick={() => setIsOpen(false)}
                    >
                        ZAPATOS
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/ropa" 
                        className={({ isActive }) => isActive ? "active-link" : ""} 
                        onClick={() => setIsOpen(false)}
                    >
                        ROPA
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/ofertas" 
                        className={({ isActive }) => `link-ofertas ${isActive ? "active-link" : ""}`} 
                        onClick={() => setIsOpen(false)}
                    >
                        OFERTAS
                    </NavLink>
                </li>
            </ul>

            {/* 3. ICONOS Y BUSCADOR */}
            <div className="nav-actions">
                <div className="search-box">
                    <input type="text" placeholder="Buscar..." className="search-input" />
                    <span className="material-symbols-outlined icon">search</span>
                </div>
                
                <Link to="/carrito" className="nav-icon-link">
                    <span className="material-symbols-outlined icon">shopping_cart</span>
                    <span className="cart-count">0</span>
                </Link>
            </div>

            {/* Menú hamburguesa (Descomentado para que funcione en móvil) */}
            <div className={`nav-toggle ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    );
};

export default Navbar;