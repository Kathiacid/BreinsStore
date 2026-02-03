// src/assets/components/ProductModal.jsx
import React from "react";
import "./ProductModal.css";

const ProductModal = ({ isOpen, onClose, product, onAddToCart }) => {
  if (!isOpen || !product) return null;

  // Lógica de precios idéntica a ProductCard
  const isSale = product.tiene_oferta_vigente;
  const originalPrice = Number(product.precio).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
  
  const finalPriceNum = product.precio_final ?? product.precio;
  const finalPriceStr = Number(finalPriceNum).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation evita que al hacer click dentro del modal se cierre */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Botón cerrar */}
        <button className="close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Imagen */}
        <div className="modal-image-container">
          <img 
            src={product.imagen_url || "https://via.placeholder.com/600x600?text=Producto"} 
            alt={product.nombre} 
            className="modal-img" 
          />
        </div>

        {/* Información */}
        <div className="modal-info">
          <p className="modal-brand">{product.marca || "GENERICO"}</p>
          <h2 className="modal-title">{product.nombre}</h2>

          <div className="modal-price-box">
            {isSale && (
              <span className="modal-original-price">{originalPrice}</span>
            )}
            <span className={`modal-final-price ${isSale ? "sale" : ""}`}>
              {finalPriceStr}
            </span>
          </div>

          <p className="modal-description">
            {product.descripcion || 
             "Descripción detallada del producto. Aquí puedes agregar información sobre materiales, cuidados, ajuste y cualquier otro detalle relevante para el cliente."}
          </p>

          <button 
            className="modal-add-btn"
            onClick={() => {
                onAddToCart(product.nombre, finalPriceStr, product.imagen_url);
                onClose(); // Opcional: cerrar modal al agregar
            }}
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;