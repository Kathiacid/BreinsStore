import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./home.css";
import Footer from "../components/footer";
import CustomDropdown from "../components/CustomDropdown";
import ProductModal from "../components/ProductModal";
import ReelsSection from "../components/ReelsSection";
import { shopifyFetch, addToCart } from "../../utils/shopify";

// Mapeo actualizado basado en tus imágenes de Shopify Admin
const COLOR_MAP = {
  "clear": "#ffffff",
  "pink": "#ffc0cb",
  "black": "#000000",
  "beige": "#f5f5dc",
  "blue": "#0000ff",
  "bronze": "#cd7f32",
  "brown": "#8b4513",
  "gold": "#ffd700",
  "gray": "#808080",
  "green":"#008031",
  "navy": "#000080",
  "orange": "#ffa500",
  "purple": "#800080",
  "red": "#ff0000",
  "rose gold": "#b76e79",
  "silver": "#c0c0c0",
  "white": "#ffffff",
  "yellow": "#ffff00",
  "animal": "#964b00", 
  "camouflage": "#4b5320",
  "checkered": "#333333",
  "dots": "#555555",
  "floral": "#ff69b4",
  "geometric": "#777777",
  "multicolor": "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
  "plaid": "#4c516d",
  "rainbow": "linear-gradient(to bottom right, red, orange, yellow, green, blue, violet)",
  "striped": "#888888",
  "tie-dye": "#a29bfe"
};

const CATEGORY_HANDLE_MAP = {
  shoes: "zapatos",   
  clothing: "ropa",   
  sale: "ofertas",
};

const CATEGORY_TRANSLATIONS = {
  all: "Catálogo Rápido",
  shoes: "Zapatos",
  clothing: "Ropa",
  sale: "Ofertas",
};

function formatPriceCOP(value) {
  const n = Number(value || 0);
  return n.toLocaleString("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0,
  });
}

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const catalogRef = useRef(null);
  const recommendedScrollRef = useRef(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [sortOption, setSortOption] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [productos, setProductos] = useState([]);
  const [recommended, setRecommended] = useState([]);

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchShopifyData = useCallback(async (isRecommended = false, category = "all") => {
    let gqlQuery = "";
    let variables = {};
    
    let sortKey = (sortOption === "price-asc" || sortOption === "price-desc") ? "PRICE" : "CREATED_AT";
    let reverse = sortOption === "price-desc" || sortOption === "newest";

    const productFields = `
      id title vendor handle description availableForSale
      featuredImage { url }
      images(first: 2) { edges { node { url } } }
      priceRange { minVariantPrice { amount } }
      options { name values }
      variants(first: 100) { 
        nodes { 
          id title availableForSale 
          compareAtPrice { amount }
          selectedOptions { name value }
        }
      }
    `;

    if (isRecommended) {
      gqlQuery = `query { products(first: 10, query: "tag:Recomendado") { edges { node { ${productFields} } } } }`;
    } 
    else if (category !== "all" && category !== "sale" && !searchQuery) {
      gqlQuery = `query getCollection($handle: String!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
        collection(handle: $handle) {
          products(first: 40, sortKey: $sortKey, reverse: $reverse) {
            edges { node { ${productFields} } }
          }
        }
      }`;
      variables = { 
        handle: CATEGORY_HANDLE_MAP[category], 
        sortKey: sortKey === "PRICE" ? "PRICE" : "CREATED",
        reverse 
      };
    } 
    else {
      let queryParts = [];
      if (searchQuery) queryParts.push(`title:*${searchQuery}* OR tag:*${searchQuery}*`);
      if (category === "sale") queryParts.push("compare_at_price:>0");
      if (category !== "all" && category !== "sale" && searchQuery) {
          queryParts.push(`tag:${CATEGORY_HANDLE_MAP[category]}`);
      }
      const finalQuery = queryParts.join(" AND ");

      gqlQuery = `query getProducts($query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
        products(first: 40, query: $query, sortKey: $sortKey, reverse: $reverse) {
          edges { node { ${productFields} } }
        }
      }`;
      variables = { query: finalQuery, sortKey, reverse };
    }

    try {
      const data = await shopifyFetch(gqlQuery, variables);
      let edges = (category !== "all" && category !== "sale" && !isRecommended && !searchQuery) 
        ? data?.collection?.products?.edges 
        : data?.products?.edges;

      const mapped = (edges || []).map(({ node }) => {
        const variantesDisponibles = node.variants?.nodes.filter(v => v.availableForSale) || [];
        const listaColores = variantesDisponibles.map(v => {
          const optColor = v.selectedOptions.find(opt => opt.name.toLowerCase() === "color");
          return optColor ? optColor.value : null;
        }).filter(Boolean);
        
        const coloresUnicos = [...new Set(listaColores)];

        return {
          ...node, 
          id: node.id,
          nombre: node.title,
          marca: node.vendor,
          disponible: node.availableForSale,
          imagen_url: node.featuredImage?.url || node.images?.edges[0]?.node.url,
          imagen_hover: node.images?.edges[1]?.node.url,
          precio: node.priceRange.minVariantPrice.amount,
          precio_original: node.variants.nodes[0]?.compareAtPrice?.amount,
          variantId: node.variants.nodes[0]?.id,
          colores: coloresUnicos 
        };
      });

      if (category === "sale") {
        return mapped.filter(p => p.precio_original && Number(p.precio_original) > Number(p.precio));
      }
      return mapped;
    } catch (err) {
      console.error("Error fetching data:", err);
      return [];
    }
  }, [searchQuery, sortOption]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [mainData, recData] = await Promise.all([
        fetchShopifyData(false, selectedCategory),
        fetchShopifyData(true)
      ]);
      setProductos(mainData);
      setRecommended(recData);
      setLoading(false);
    };
    load();
  }, [fetchShopifyData, selectedCategory, sortOption]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("search") || "";
    const c = params.get("category") || "all";
    setSearchQuery(s);
    setSelectedCategory(c);
    if (location.search || (c === "all" && location.hash === "#catalog")) {
      setTimeout(scrollToCatalog, 100);
    }
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal-on-scroll");
      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 50) {
          el.classList.add("visible");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="home-container">
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={async (vId) => { await addToCart(vId, 1); }}
      />

      <div className="top-banner">ENVIO GRATIS SOBRE $199.000 EN COLOMBIA</div>

      <section className="hero">
        <div className="hero-content reveal-on-scroll">
          <span className="hero-tag">ATREVETE CON </span>
          <h1 className="hero-title">BREINS<br /><span>STORE</span></h1>
          <p className="hero-text">Descubre tu estilo al mejor precio.</p>
          <div className="hero-btns">
            <Link to="/?category=shoes" className="btn-solid">Zapatos</Link>
            <Link to="/?category=clothing" className="btn-outline">Ropa</Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          <div className="section-header reveal-on-scroll">
            <h2 className="display-title">Recomendado para ti</h2>
            <div className="nav-arrows">
              <button className="arrow-btn" onClick={() => recommendedScrollRef.current.scrollBy({left: -320, behavior: "smooth"})}>
                <span className="material-symbols-outlined">west</span>
              </button>
              <button className="arrow-btn" onClick={() => recommendedScrollRef.current.scrollBy({left: 320, behavior: "smooth"})}>
                <span className="material-symbols-outlined">east</span>
              </button>
            </div>
          </div>
          <div className="horizontal-scroll no-scrollbar reveal-on-scroll" ref={recommendedScrollRef}>
            {recommended.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={() => {setSelectedProduct(p); setIsModalOpen(true)}} />
            ))}
          </div>
        </div>
      </section>

      <section className="category-full-grid">
        <CategoryItem title="Zapatos" img="/1.jpg" link="/?category=shoes" />
        <CategoryItem title="Ropa" img="/2.jpg" link="/?category=clothing" />
        <CategoryItem title="Ofertas" img="/4.jpg" link="/?category=sale" />
      </section>

      <section className="parallax-section">
        <div className="parallax-content reveal-on-scroll">
          <span className="hero-tag">@BREINS_STORE</span>
          <h2 className="parallax-title">El Flow en Movimiento</h2>
          <p className="parallax-text">Únete al parche en Instagram.</p>
          <a href="https://www.instagram.com/breins_shoes/" target="_blank" rel="noopener noreferrer">
            <button className="btn-solid">Seguir</button>
          </a>
        </div>
      </section>

      <ReelsSection />

      <section className="section-padding bg-light" id="catalog" ref={catalogRef}>
        <div className="container">
          <h2 className="display-title reveal-on-scroll">
            {searchQuery 
              ? `Resultados de: "${searchQuery}"` 
              : `${CATEGORY_TRANSLATIONS[selectedCategory] || "Catálogo"}`}
          </h2>
          <div className="catalog-layout">
            <aside className="filters-sidebar reveal-on-scroll">
              <div className="filter-group">
                <h4>Ordenar por</h4>
                <CustomDropdown 
                  value={sortOption} 
                  onChange={setSortOption} 
                  options={[
                    { value: "newest", label: "Lo más nuevo" },
                    { value: "price-asc", label: "Precio: Menor a Mayor" },
                    { value: "price-desc", label: "Precio: Mayor a Menor" },
                  ]} 
                />
              </div>
              <div className="filter-group">
                <h4>Categoría</h4>
                <div className="category-list">
                  {['all', 'shoes', 'clothing', 'sale'].map(cat => (
                    <label key={cat} className={`cat-option ${selectedCategory === cat ? "active" : ""}`}>
                      <input 
                        type="radio" 
                        name="cat-filter"
                        checked={selectedCategory === cat} 
                        onChange={() => navigate(cat === 'all' ? '/?category=all#catalog' : `/?category=${cat}`)} 
                      />
                      {cat === 'all' ? 'Todo' : cat === 'shoes' ? 'Zapatos' : cat === 'clothing' ? 'Ropa' : 'Ofertas %'}
                    </label>
                  ))}
                </div>
              </div>
            </aside>
            <div className="products-grid reveal-on-scroll">
              {loading ? (
                <p style={{ padding: "20px" }}>Cargando catálogo...</p>
              ) : productos.length > 0 ? (
                productos.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={() => {setSelectedProduct(p); setIsModalOpen(true)}} />
                ))
              ) : (
                <p style={{ padding: "20px" }}>No se encontraron productos.</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

const ProductCard = ({ product, onOpen }) => {
  const estaDisponible = product.disponible && product.variants?.nodes[0]?.availableForSale;
  const porcentajeDescuento = 
    product.precio_original && Number(product.precio_original) > Number(product.precio)
      ? Math.round(((Number(product.precio_original) - Number(product.precio)) / Number(product.precio_original)) * 100)
      : null;

  return (
    <div className={`product-card group ${!estaDisponible ? 'out-of-stock' : ''}`} onClick={estaDisponible ? onOpen : null}>
      <div className="img-container">
        {estaDisponible && porcentajeDescuento && (
          <div className="discount-badge-vertical">-{porcentajeDescuento}%</div>
        )}
        <div style={{ height: '100%' }}>
          <img src={product.imagen_url} alt={product.nombre} className="main-img" />
          {product.imagen_hover && <img src={product.imagen_hover} alt={product.nombre} className="hover-img" />}
          {!estaDisponible && <div className="stock-badge">Agotado</div>}
        </div>
        {estaDisponible && (
          <div className="card-buttons-container">
            <button className="card-btn btn-view" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
              <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>visibility</span>
              VER PRODUCTO
            </button>
          </div>
        )}
      </div>
      <div className="product-info-box" style={{textAlign: 'center', padding: '10px'}}>
        <p className="prod-brand">{product.marca || "BREINS"}</p>
        <h3 className="prod-name">{product.nombre}</h3>
        
        {product.colores && product.colores.length > 0 && (
          <div className="product-colors-swatch">
            {product.colores.map(color => (
              <span 
                key={color} 
                className="color-circle" 
                style={{ background: COLOR_MAP[color.toLowerCase().trim()] || "#E2E8F0" }} 
                title={color}
              />
            ))}
          </div>
        )}

        <div className="prod-price-container">
          {product.precio_original && Number(product.precio_original) > Number(product.precio) && (
            <span className="original-price" style={{textDecoration: 'line-through', opacity: 0.5, marginRight: '8px'}}>
              {formatPriceCOP(product.precio_original)}
            </span>
          )}
          <span className="final-price" style={{fontWeight: 'bold'}}>{formatPriceCOP(product.precio)}</span>
        </div>
      </div>
    </div>
  );
};

const CategoryItem = ({ title, img, link }) => (
  <Link to={link} className="cat-item reveal-on-scroll">
    <img src={img} alt={title} />
    <div className="cat-overlay">
      <h3>{title}</h3>
      <span className="explore-btn">EXPLORAR</span>
    </div>
  </Link>
);

export default Home;