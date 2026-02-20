import React from "react";
import "./ProductModal.css";

const ProductModal = ({ isOpen, onClose, product, onAddToCart }) => {
  if (!isOpen || !product) return null;

  // Extraemos la información de disponibilidad
  const estaDisponible = product.availableForSale;
  
  // Extraemos precios
  const price = product.priceRange.minVariantPrice.amount;
  const compareAtPrice = product.variants.nodes[0]?.compareAtPrice?.amount;
  const isSale = compareAtPrice && Number(compareAtPrice) > Number(price);

  const formatPrice = (val) => Number(val).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="modal-image-container">
          {/* Si no hay stock, podemos aplicar un filtro visual opcional aquí */}
          <img 
            src={product.featuredImage?.url || product.imagen_url} 
            alt={product.title} 
            className={`modal-img ${!estaDisponible ? 'grayscale' : ''}`} 
          />
        </div>

        <div className="modal-info">
          <p className="modal-brand">{product.vendor || "BREINS STORE"}</p>
          <h2 className="modal-title">{product.title}</h2>

          <div className="modal-price-box">
            {isSale && <span className="modal-original-price">{formatPrice(compareAtPrice)}</span>}
            <span className={`modal-final-price ${isSale ? "sale" : ""}`}>{formatPrice(price)}</span>
          </div>

          <p className="modal-description">{product.description || "Sin descripción disponible."}</p>

          {/* Botón con validación de stock integrada */}
          <button 
            className={`modal-add-btn ${!estaDisponible ? 'disabled' : ''}`}
            disabled={!estaDisponible}
            onClick={() => {
                if(estaDisponible) {
                  // Usamos el ID de la variante para Shopify
                  onAddToCart(product.variants.nodes[0].id);
                  onClose();
                }
            }}
          >
            {estaDisponible ? 'Agregar al Carrito' : 'Producto Agotado'}
          </button>
          
          {!estaDisponible && (
            <p style={{ color: '#e63946', fontSize: '0.8rem', marginTop: '10px', fontWeight: '600' }}>
              Este producto no se encuentra disponible por el momento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;