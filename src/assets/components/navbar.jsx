import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Importamos useNavigate
import './navbar.css'; 

const Navbar = ({ onCartClick, cartCount }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // ✅ Estado para el texto
    const navigate = useNavigate(); // ✅ Hook de navegación

    const closeMenu = () => setIsOpen(false);

    const handleHomeClick = () => {
        setSearchTerm(""); // Limpiar búsqueda al ir a inicio
        closeMenu(); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ✅ Función para ejecutar la búsqueda
    const handleSearch = () => {
        if (searchTerm.trim()) {
            // Navega a la home con el parámetro ?search=...
            navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
            closeMenu();
            // Scroll al catálogo para ver resultados
            setTimeout(() => {
                const catalog = document.getElementById('catalog');
                if(catalog) catalog.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    // ✅ Detectar tecla Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-logo">
                <Link to="/" onClick={handleHomeClick}>
                    <span className="logo-bold">BREINS</span>
                    <span className="logo-light">STORE</span>
                </Link>
            </div>

            <ul className={`nav-menu ${isOpen ? "open" : ""}`}>
                <li><Link to="/" onClick={handleHomeClick}>INICIO</Link></li>
                <li><Link to="/?category=shoes" onClick={closeMenu}>ZAPATOS</Link></li>
                <li><Link to="/?category=clothing" onClick={closeMenu}>ROPA</Link></li>
                <li><Link to="/?category=sale" className="link-ofertas" onClick={closeMenu}>OFERTAS</Link></li>
            </ul>

            <div className="nav-actions">
                {/* ✅ BARRA DE BÚSQUEDA FUNCIONAL */}
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="Buscar..." 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <span 
                        className="material-symbols-outlined icon" 
                        onClick={handleSearch}
                        style={{ cursor: 'pointer' }}
                    >
                        search
                    </span>
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

            <div className={`nav-toggle ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    );
};

export default Navbar;