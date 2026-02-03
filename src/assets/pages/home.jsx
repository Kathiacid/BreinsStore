import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLocation, Link } from "react-router-dom"; 
import "./home.css";
import Footer from "../components/footer";
import CustomDropdown from "../components/CustomDropdown";
import { useProductos } from "../hook/useProductos";
import shopService from "../services/shopService";
import ProductModal from "../components/ProductModal"; // Asegúrate de tener este componente creado




// 0. DEFINICIÓN DE COLORES
const COMMON_COLORS = [
  { id: "negro", label: "Negro", hex: "#212121" },
  { id: "blanco", label: "Blanco", hex: "#FFFFFF", border: true },
  { id: "gris", label: "Gris", hex: "#9E9E9E" },
  { id: "azul", label: "Azul", hex: "#1565C0" },
  { id: "rojo", label: "Rojo", hex: "#D32F2F" },
  { id: "verde", label: "Verde", hex: "#388E3C" },
  { id: "beige", label: "Beige", hex: "#F5F5DC", border: true },
  { id: "amarillo", label: "Amarillo", hex: "#FBC02D" },
];

// ✅ MAPEO UI -> IDs BACKEND
const CATEGORY_ID_MAP = {
  shoes: 2,    // Zapatos
  clothing: 3, // Ropa
};

// ✅ Formateo COP
function formatPriceCOP(value) {
  const n = Number(value || 0);
  return n.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

// ✅ Extraer lista de la respuesta de la API
function extractList(data) {
  if (Array.isArray(data?.results?.results)) return data.results.results;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data)) return data;
  return [];
}

const Home = ({ onAddProduct }) => {
  const location = useLocation();

  // ✅ Estados del Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Estados de Filtros (Sin precio)
  const [sortOption, setSortOption] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all"); 
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState([]); 

  // Recomendados
  const [recommended, setRecommended] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const recommendedScrollRef = useRef(null);

  // Hook productos catálogo
  const { productos, meta, loading, error, updateFilters } = useProductos({
    ordering: "-created_at",
  });

  // --- HANDLERS MODAL ---
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // ✅ 1. Sincronizar URL con Categoría y Resetear
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get("category");

    if (categoryParam) {
      if (categoryParam === "shoes") setSelectedCategory("shoes");
      else if (categoryParam === "clothing") setSelectedCategory("clothing");
      else if (categoryParam === "sale") setSelectedCategory("sale");
      
      // Auto-scroll al catálogo
      setTimeout(() => {
        const catalogSection = document.getElementById("catalog");
        if (catalogSection) catalogSection.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } else {
      // ✅ RESET TOTAL EN INICIO
      setSelectedCategory("all");
      setSortOption("newest");      
      setSelectedColor("all");       
      setSelectedBrands([]);         
    }
  }, [location.search]);

  // ✅ 2. Limpieza auxiliar al cambiar categoría manual
  useEffect(() => {
    if (selectedCategory !== 'all') {
        setSelectedBrands([]);
        setSelectedColor("all");
    }
  }, [selectedCategory]); 

  // ✅ 3. Scroll Reveal
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal-on-scroll");
      reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        if (revealTop < windowHeight - 100) el.classList.add("visible");
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollRecommended = (direction) => {
    if (!recommendedScrollRef.current) return;
    const scrollAmount = 320;
    recommendedScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // ✅ 4. Cargar Recomendados
  useEffect(() => {
    const loadRecommended = async () => {
      setRecommendedLoading(true);
      try {
        const data = await shopService.getProductos({
          solo_recomendados: true,
          ordering: "-created_at",
        });
        setRecommended(extractList(data));
      } catch (e) {
        console.error(e);
        setRecommended([]);
      } finally {
        setRecommendedLoading(false);
      }
    };
    loadRecommended();
  }, []);

  // ✅ 5. Marcas Dinámicas
  const brandOptions = useMemo(() => {
    const set = new Set();
    (productos || []).forEach((p) => {
      const m = (p?.marca || "").trim();
      if (m) set.add(m);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [productos]);

  // ✅ 6. Construcción de Filtros API
  const apiFilters = useMemo(() => {
    let ordering = "-created_at"; 
    if (sortOption === "price-asc") ordering = "precio";
    if (sortOption === "price-desc") ordering = "-precio";
    
    const f = { ordering };

    if (selectedCategory === "sale") {
      f.solo_ofertas = true; 
    } else if (selectedCategory !== "all") {
      const mappedId = CATEGORY_ID_MAP[selectedCategory];
      if (mappedId) f.categoria = mappedId;
    }

    if (selectedColor !== "all") {
        f.color = selectedColor;
    }

    if (selectedBrands.length > 0) {
      f.search = selectedBrands[0];
    }

    return f;
  }, [sortOption, selectedCategory, selectedColor, selectedBrands]);

  useEffect(() => {
    updateFilters(apiFilters);
  }, [apiFilters, updateFilters]);

  // Handlers UI
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => {
      const exists = prev.includes(brand);
      if (exists) return prev.filter((b) => b !== brand);
      return [...prev, brand];
    });
  };

  const clearBrands = () => setSelectedBrands([]);

  return (
    <div className="home-container">
      {/* ✅ MODAL GLOBAL */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onAddToCart={onAddProduct}
      />

      <div className="top-banner">
        ENVIO GRATIS SOBRE $199.000 EN TODO EL TERRITORIO NACIONAL
      </div>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content reveal-on-scroll">
          <span className="hero-tag">ATREVETE CON </span>
          <h1 className="hero-title">
            BREINS<br />
            STORE
          </h1>
          <p className="hero-text">Descubre tu estilo al mejor precio.</p>
          <div className="hero-btns">
            {/* Botones como Links para activar filtros */}
            <Link to="/?category=shoes" className="btn-solid">
              Zapatos
            </Link>
            <Link to="/?category=clothing" className="btn-outline">
              Ropa
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN RECOMENDADOS */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="section-header reveal-on-scroll">
            <div>
              <h2 className="display-title">Recomendado para ti</h2>
              <p className="subtitle">Selección de temporada</p>
            </div>
            <div className="nav-arrows">
              <button className="arrow-btn" onClick={() => scrollRecommended("left")}>
                <span className="material-symbols-outlined">west</span>
              </button>
              <button className="arrow-btn" onClick={() => scrollRecommended("right")}>
                <span className="material-symbols-outlined">east</span>
              </button>
            </div>
          </div>

          <div className="horizontal-scroll no-scrollbar reveal-on-scroll" ref={recommendedScrollRef}>
            {recommendedLoading ? (
              <p style={{ padding: 16 }}>Cargando recomendados...</p>
            ) : recommended.length === 0 ? (
              <p style={{ padding: 16 }}>
                No hay recomendados por ahora.
              </p>
            ) : (
              recommended.map((p) => {
                const finalPriceVal = p.precio_final ?? p.precio;
                const finalPriceStr = formatPriceCOP(finalPriceVal);

                return (
                  // ✅ ENVOLTORIO CLAVE: Ancho fijo para carrusel
                  <div key={p.id} style={{ flex: '0 0 auto', width: '280px', margin: '0 10px' }}>
                      <ProductCard
                          badge={p.tiene_oferta_vigente ? `${p.descuento_porcentaje}% OFF` : null}
                          brand={p.marca}
                          name={p.nombre}
                          originalPrice={formatPriceCOP(p.precio)} 
                          finalPrice={finalPriceStr}
                          img1={p.imagen_url || "https://via.placeholder.com/600x600?text=Producto"}
                          img2={p.imagenes?.[0]?.imagen_url || null}
                          isSale={!!p.tiene_oferta_vigente}
                          onAdd={() => onAddProduct(p.nombre, finalPriceStr, p.imagen_url)}
                          onOpenModal={() => handleOpenModal(p)}
                      />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIAS GRID */}
      <section className="category-full-grid">
        <CategoryItem
          title="Zapatos"
          img="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800"
        />
        <CategoryItem
          title="Ropa"
          img="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800"
        />
        <CategoryItem
          title="Ofertas"
          img="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800"
        />
      </section>

      <section className="parallax-section">
        <div className="parallax-content reveal-on-scroll">
          <span className="hero-tag">@BREINS_STORE</span>
          <h2 className="parallax-title">El Flow en Movimiento</h2>
          <p className="parallax-text">
            Únete al parche en Instagram. Así se llevan nuestros sneakers en la calle.
          </p>
          <button className="btn-solid">Seguir</button>
        </div>
      </section>

      {/* CATALOGO */}
      <section className="section-padding bg-light" id="catalog">
        <div className="container">
          <div className="catalog-header reveal-on-scroll">
            <h2 className="display-title">Catálogo Rápido</h2>
            {meta?.count != null && (
              <p className="subtitle" style={{ marginTop: 6 }}>
                Total: {meta.count}
              </p>
            )}
          </div>

          <div className="catalog-layout">
            <aside className="filters-sidebar reveal-on-scroll">
              
              {/* ORDENAR */}
              <div className="filter-group">
                <div className="flex-between">
                  <h4>Ordenar por</h4>
                  {sortOption !== "newest" && (
                    <button className="clear-filter-btn" onClick={() => setSortOption("newest")}>
                      Limpiar
                    </button>
                  )}
                </div>
                <CustomDropdown
                  value={sortOption}
                  onChange={(val) => setSortOption(val)}
                  placeholder="Lo más nuevo"
                  options={[
                    { value: "newest", label: "Lo más nuevo" },
                    { value: "price-asc", label: "Precio: Menor a Mayor" },
                    { value: "price-desc", label: "Precio: Mayor a Menor" },
                  ]}
                  className="sort-dropdown"
                />
              </div>

              {/* CATEGORIA */}
              <div className="filter-group">
                <h4>Categoría</h4>
                <div className="category-list">
                  <label className={`cat-option ${selectedCategory === "all" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "all"}
                      onChange={() => setSelectedCategory("all")}
                    />
                    Todo
                  </label>
                  <label className={`cat-option ${selectedCategory === "shoes" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "shoes"}
                      onChange={() => setSelectedCategory("shoes")}
                    />
                    Zapatos
                  </label>
                  <label className={`cat-option ${selectedCategory === "clothing" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "clothing"}
                      onChange={() => setSelectedCategory("clothing")}
                    />
                    Ropa
                  </label>
                  <label className={`cat-option sale-option ${selectedCategory === "sale" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "sale"}
                      onChange={() => setSelectedCategory("sale")}
                    />
                    Ofertas %
                  </label>
                </div>
              </div>

              {/* COLOR */}
              <div className="filter-group">
                <div className="flex-between">
                  <h4>Color</h4>
                  {selectedColor !== "all" && (
                    <button className="clear-filter-btn" onClick={() => setSelectedColor("all")}>
                      Limpiar
                    </button>
                  )}
                </div>
                <div className="color-grid">
                  {COMMON_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`color-swatch ${selectedColor === color.id ? "active" : ""}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    >
                      {color.border && <span className="swatch-border"></span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* MARCAS */}
              <div className="filter-group">
                <div className="flex-between">
                  <h4>Marcas</h4>
                  {selectedBrands.length > 0 && (
                    <button className="clear-filter-btn" onClick={clearBrands}>
                      Limpiar
                    </button>
                  )}
                </div>
                {brandOptions.length === 0 ? (
                  <p style={{ marginTop: 8, opacity: 0.75 }}>
                    Aún no hay marcas en esta selección.
                  </p>
                ) : (
                  <div className="checkbox-list">
                    {brandOptions.map((brand) => (
                      <label key={brand} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </aside>

            {/* GRID PRODUCTOS */}
            <div className="products-grid reveal-on-scroll">
              {loading ? (
                <p style={{ padding: 16 }}>Cargando productos...</p>
              ) : error ? (
                <p style={{ padding: 16 }}>{error}</p>
              ) : productos.length === 0 ? (
                <p style={{ padding: 16 }}>No hay productos con esos filtros.</p>
              ) : (
                productos.map((p) => {
                  const finalPriceVal = p.precio_final ?? p.precio;
                  const finalPriceStr = formatPriceCOP(finalPriceVal);

                  return (
                    <ProductCard
                      key={p.id}
                      badge={p.tiene_oferta_vigente ? `${p.descuento_porcentaje}% OFF` : null}
                      brand={p.marca}
                      name={p.nombre}
                      originalPrice={formatPriceCOP(p.precio)} 
                      finalPrice={finalPriceStr}
                      img1={p.imagen_url || "https://via.placeholder.com/600x600?text=Producto"}
                      img2={null}
                      isSale={!!p.tiene_oferta_vigente}
                      onAdd={() => onAddProduct(p.nombre, finalPriceStr, p.imagen_url)}
                      onOpenModal={() => handleOpenModal(p)}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/* ✅ COMPONENTE PRODUCT CARD OPTIMIZADO 
   - Aspect Ratio forzado (Cuadrado).
   - Flexbox vertical para igualar altura.
   - Contenido centrado y completo.
*/
const ProductCard = ({ badge, brand, name, originalPrice, finalPrice, img1, img2, isSale, onAdd, onOpenModal }) => (
  <div 
    className="product-card group" 
    style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#fff', 
        borderRadius: '8px',
        overflow: 'hidden'
    }}
  >
    {/* Contenedor Imagen (Clickable -> Modal) */}
    <div className="img-container" 
         onClick={onOpenModal} 
         style={{ 
            width: '100%', 
            aspectRatio: '1 / 1', 
            position: 'relative', 
            overflow: 'hidden',
            cursor: 'pointer' 
         }}>
      <img 
        src={img1} 
        alt={name} 
        className="main-img" 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />
      {img2 && (
        <img 
            src={img2} 
            alt={name} 
            className="hover-img" 
            style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0
            }} 
        />
      )}
      
      {badge && <div className={`badge ${isSale ? "sale" : ""}`}>{badge}</div>}
      
      {/* Botón Agregar (No abre modal) */}
      <button 
        className="add-cart-btn" 
        onClick={(e) => { e.stopPropagation(); onAdd(); }}
      >
        Agregar
      </button>
    </div>
    
    {/* Info del Producto */}
    <div style={{ padding: '12px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p className="prod-brand" style={{ 
            fontSize: '0.75rem', 
            color: '#888', 
            textTransform: 'uppercase', 
            fontWeight: '700',
            letterSpacing: '0.5px',
            marginBottom: '6px' 
        }}>
            {brand || "GENERICO"}
        </p>

        <h3 className="prod-name" style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            marginBottom: '8px', 
            lineHeight: '1.3' 
        }}>
            {name}
        </h3>

        <div className="prod-price-container" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '8px', 
            marginTop: 'auto' 
        }}>
            {isSale && (
                <span className="original-price" style={{ 
                    textDecoration: 'line-through', 
                    color: '#999', 
                    fontSize: '0.9rem' 
                }}>
                    {originalPrice}
                </span>
            )}
            <span className="final-price" style={{ 
                fontWeight: 'bold', 
                fontSize: '1.05rem', 
                color: isSale ? '#D32F2F' : '#212121' 
            }}>
                {finalPrice}
            </span>
        </div>
    </div>
  </div>
);

const CategoryItem = ({ title, img }) => (
  <div className="cat-item reveal-on-scroll">
    <img src={img} alt={title} />
    <div className="cat-overlay">
      <h3>{title}</h3>
      <span className="explore-btn">EXPLORAR CATEGORÍA</span>
    </div>
  </div>
);

export default Home;