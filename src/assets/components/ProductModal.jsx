import React, { useState, useEffect, useMemo } from "react";
import "./ProductModal.css";

const COLOR_MAP = {
  "clear": "#ffffff", "green": "#008031", "pink": "#ffc0cb", "black": "#000000", "beige": "#f5f5dc",
  "blue": "#0000ff", "bronze": "#cd7f32", "brown": "#8b4513", "gold": "#ffd700",
  "gray": "#808080", "navy": "#000080", "orange": "#ffa500", "purple": "#800080",
  "red": "#ff0000", "rose gold": "#b76e79", "silver": "#c0c0c0", "white": "#ffffff",
  "yellow": "#ffff00", "animal": "#964b00", "camouflage": "#4b5320",
  "multicolor": "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
  "rainbow": "linear-gradient(to bottom right, red, orange, yellow, green, blue, violet)"
};

const ProductModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (product) {
      setSelectedColor(null);
      setSelectedSize(null);
      setMainImage(product.featuredImage?.url || product.imagen_url);
    }
  }, [product, isOpen]);

  const isSizeOption = (name) => {
    const n = name.toLowerCase();
    return n.includes("talla") || n.includes("size") || n.includes("talle");
  };

  const images = useMemo(() => {
    if (!product) return [];
    const imgs = [product.featuredImage?.url || product.imagen_url];
    if (product.imagen_hover) imgs.push(product.imagen_hover);
    return imgs.filter(Boolean);
  }, [product]);

  const allPossibleSizes = useMemo(() => {
    if (!product?.variants?.nodes) return [];
    const sizes = product.variants.nodes.flatMap(v => 
      v.selectedOptions?.filter(opt => isSizeOption(opt.name)).map(opt => opt.value) || []
    );
    return [...new Set(sizes)].sort((a, b) => (isNaN(a) ? 0 : a - b));
  }, [product]);

  const availableSizesForColor = useMemo(() => {
    if (!selectedColor || !product?.variants?.nodes) return [];
    return product.variants.nodes
      .filter(v => v.availableForSale && v.selectedOptions?.some(opt => opt.value === selectedColor))
      .flatMap(v => v.selectedOptions?.filter(opt => isSizeOption(opt.name)).map(opt => opt.value) || []);
  }, [selectedColor, product]);

  if (!isOpen || !product) return null;

  // LÓGICA DE PRECIOS IGUAL AL CATÁLOGO
  const precioActual = product.priceRange?.minVariantPrice?.amount || 0;
  const precioOriginal = product.variants?.nodes[0]?.compareAtPrice?.amount;
  const tieneDescuento = precioOriginal && Number(precioOriginal) > Number(precioActual);

  const formatPrice = (val) => {
    return Number(val).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  };

  const handleAdd = () => {
    const variant = product.variants.nodes.find(v => 
      v.availableForSale && 
      (allPossibleSizes.length === 0 || v.selectedOptions.some(opt => isSizeOption(opt.name) && opt.value === selectedSize)) &&
      (!product.colores || product.colores.length === 0 || v.selectedOptions.some(opt => opt.name.toLowerCase() === "color" && opt.value === selectedColor))
    );

    if (variant) {
      onAddToCart(variant.id, 1);
      onClose();
    } else {
      alert("Lo sentimos, esta combinación no tiene stock.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-elegant" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn-minimal" onClick={onClose}>×</button>

        <div className="modal-body">
          <div className="gallery-section">
            <div className="thumbnails">
              {images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  className={`thumb ${mainImage === img ? "active" : ""}`} 
                  onClick={() => setMainImage(img)}
                  alt="Vista previa"
                />
              ))}
            </div>
            <div className="main-display">
              <img src={mainImage} alt={product.title} />
            </div>
          </div>

          <div className="info-section">
            <div className="header-box">
              <span className="brand-tag">{product.vendor || "BREINS"}</span>
              <h2 className="title-elegant">{product.title}</h2>
              
              {/* PRECIO RENDERIZADO COMO EN EL HOME */}
              <div className="price-container-modal">
                {tieneDescuento && (
                  <span className="original-price-modal" style={{ textDecoration: 'line-through', opacity: 0.5, marginRight: '10px', fontSize: '1.1rem' }}>
                    {formatPrice(precioOriginal)}
                  </span>
                )}
                <span className="price-elegant" style={{ fontWeight: 'bold' }}>
                  {formatPrice(precioActual)}
                </span>
              </div>
            </div>

            <div className="selectors-container">
              {product.colores?.length > 0 && (
                <div className="selector-group">
                  <label>Color: <strong>{selectedColor || "Seleccionar"}</strong></label>
                  <div className="swatch-list">
                    {product.colores.map(color => (
                      <div 
                        key={color}
                        className={`swatch-item ${selectedColor === color ? "active" : ""}`}
                        style={{ background: COLOR_MAP[color.toLowerCase().trim()] || "#ccc" }}
                        onClick={() => { setSelectedColor(color); setSelectedSize(null); }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {allPossibleSizes.length > 0 && (
                <div className="selector-group">
                  <label>Talla: <strong>{selectedSize || "Seleccionar"}</strong></label>
                  <div className="size-list">
                    {allPossibleSizes.map(size => {
                      const isAvailable = !selectedColor || availableSizesForColor.includes(size);
                      return (
                        <button
                          key={size}
                          disabled={!isAvailable}
                          className={`size-item ${selectedSize === size ? "active" : ""}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button 
              className="btn-add-to-cart"
              disabled={!product.availableForSale || (allPossibleSizes.length > 0 && !selectedSize)}
              onClick={handleAdd}
            >
              {!product.availableForSale ? "SIN STOCK" : !selectedSize && allPossibleSizes.length > 0 ? "ELEGIR TALLA" : "AÑADIR AL CARRITO"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;