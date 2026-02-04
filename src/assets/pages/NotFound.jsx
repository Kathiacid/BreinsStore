import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import shopService from '../services/shopService'; // Importamos tu servicio
import './NotFound.css';

const NotFound = () => {
    const [suggestions, setSuggestions] = useState([]);
    const titleRef = useRef(null);

    // 1. Efecto Parallax en el texto 404
    const handleMouseMove = (e) => {
        const title = titleRef.current;
        if (title) {
            const x = (window.innerWidth - e.pageX * 2) / 50;
            const y = (window.innerHeight - e.pageY * 2) / 50;
            title.style.transform = `translateX(${x}px) translateY(${y}px)`;
        }
    };

    // 2. Cargar "Sugerencias" para no perder al cliente
    useEffect(() => {
        const loadSuggestions = async () => {
            try {
                // Pedimos 4 productos aleatorios o los últimos
                const data = await shopService.getProductos({ 
                    page_size: 4, 
                    ordering: "?" // '?' suele dar random en algunas APIs, si no usa '-created_at'
                });
                
                let list = [];
                if (Array.isArray(data?.results?.results)) list = data.results.results;
                else if (Array.isArray(data?.results)) list = data.results;
                else if (Array.isArray(data)) list = data;

                setSuggestions(list.slice(0, 4)); // Aseguramos máximo 4
            } catch (error) {
                console.error("Error cargando sugerencias 404", error);
            }
        };
        loadSuggestions();
    }, []);

    // Formateador simple
    const formatPrice = (val) => Number(val).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

    return (
        <div className="not-found-container" onMouseMove={handleMouseMove}>
            
            <div className="error-code-wrapper">
                <h1 className="error-code" ref={titleRef}>404</h1>
                <div className="error-tag">SOLD OUT</div>
            </div>

            <h2 className="error-msg">Te perdiste en el Hype</h2>
            <p className="error-sub">
                La página que buscas no existe o fue eliminada. 
                Pero el estilo sigue aquí.
            </p>

            <Link to="/" className="btn-home">
                Volver al Inicio
            </Link>

            {/* Sugerencias Dinámicas */}
            {suggestions.length > 0 && (
                <div className="rescue-section">
                    <span className="rescue-title">Quizás buscabas esto</span>
                    
                    <div className="rescue-grid">
                        {suggestions.map((item) => (
                            <Link to={`/`} key={item.id} className="mini-card">
                                <div className="mini-img-box">
                                    <img 
                                        src={item.imagen_url || "https://via.placeholder.com/300"} 
                                        alt={item.nombre} 
                                    />
                                </div>
                                <div className="mini-info">
                                    <h4>{item.nombre}</h4>
                                    <span>{formatPrice(item.precio_final ?? item.precio)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotFound;