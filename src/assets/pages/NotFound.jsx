import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { shopifyFetch } from "../../utils/shopify"; // Tu utilidad personalizada
import "./NotFound.css";

const NotFound = () => {
  const [suggestions, setSuggestions] = useState([]);
  const titleRef = useRef(null);

  const handleMouseMove = (e) => {
    const title = titleRef.current;
    if (title) {
      const x = (window.innerWidth - e.pageX * 2) / 50;
      const y = (window.innerHeight - e.pageY * 2) / 50;
      title.style.transform = `translateX(${x}px) translateY(${y}px)`;
    }
  };

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const query = `{
          products(first: 4) {
            edges {
              node {
                id
                title
                handle
                images(first: 1) { edges { node { url } } }
                priceRange { minVariantPrice { amount currencyCode } }
              }
            }
          }
        }`;
        const data = await shopifyFetch(query);
        const mapped = data.products.edges.map((item) => ({
          id: item.node.id,
          nombre: item.node.title,
          handle: item.node.handle,
          imagen_url: item.node.images.edges[0]?.node.url,
          precio: item.node.priceRange.minVariantPrice.amount,
          currency: item.node.priceRange.minVariantPrice.currencyCode,
        }));
        setSuggestions(mapped);
      } catch (error) {
        console.error("Error cargando sugerencias 404", error);
      }
    };
    loadSuggestions();
  }, []);

  const formatPrice = (val, currency) =>
    Number(val).toLocaleString("es-CO", {
      style: "currency",
      currency: currency || "COP",
      maximumFractionDigits: 0,
    });

  return (
    <div className="not-found-container" onMouseMove={handleMouseMove}>
      <div className="error-code-wrapper">
        <h1 className="error-code" ref={titleRef}>404</h1>
        <div className="error-tag">SOLD OUT</div>
      </div>

      <h2 className="error-msg">Te perdiste en el Hype</h2>
      <p className="error-sub">La página que buscas no existe o fue eliminada.</p>

      <Link to="/" className="btn-home">Volver al Inicio</Link>

      {suggestions.length > 0 && (
        <div className="rescue-section">
          <span className="rescue-title">Quizás buscabas esto</span>
          <div className="rescue-grid">
            {suggestions.map((item) => (
              <Link to={`/producto/${item.handle}`} key={item.id} className="mini-card">
                <div className="mini-img-box">
                  <img src={item.imagen_url || "https://via.placeholder.com/300"} alt={item.nombre} />
                </div>
                <div className="mini-info">
                  <h4>{item.nombre}</h4>
                  <span>{formatPrice(item.precio, item.currency)}</span>
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