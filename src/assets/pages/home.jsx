import React, { useEffect } from 'react';
import './home.css';

const Home = () => {
    useEffect(() => {
        const handleScroll = () => {
            const reveals = document.querySelectorAll('.reveal-on-scroll');
            reveals.forEach(el => {
                const windowHeight = window.innerHeight;
                const revealTop = el.getBoundingClientRect().top;
                if (revealTop < windowHeight - 100) el.classList.add('visible');
            });
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="home-container">
            {/* 1. TOP ANNOUNCEMENT */}
            <div className="top-banner">
                FREE GLOBAL SHIPPING ON ORDERS OVER $150 | PREMIUM CRAFTED QUALITY
            </div>

            {/* 2. HERO SECTION */}
            <section className="hero">
                <div className="hero-content reveal-on-scroll">
                    <span className="hero-tag">THE HERITAGE COLLECTION</span>
                    <h1 className="hero-title">MODERN<br/>FRONTIER</h1>
                    <p className="hero-text">Defining the intersection of rugged craftsmanship and contemporary urban aesthetics.</p>
                    <div className="hero-btns">
                        <button className="btn-solid">SHOP COLLECTION</button>
                        <button className="btn-outline">THE LOOKBOOK</button>
                    </div>
                </div>
            </section>

            {/* 3. RECOMMENDED SECTION */}
            <section className="section-padding bg-white">
                <div className="container">
                    <div className="section-header reveal-on-scroll">
                        <div>
                            <h2 className="display-title">Recommended for you</h2>
                            <p className="subtitle">Curated based on your style profile</p>
                        </div>
                        <div className="nav-arrows">
                            <button className="arrow-btn"><span className="material-symbols-outlined">west</span></button>
                            <button className="arrow-btn"><span className="material-symbols-outlined">east</span></button>
                        </div>
                    </div>
                    
                    <div className="horizontal-scroll no-scrollbar reveal-on-scroll">
                        <ProductCard badge="Best Seller" name="Elite Suede Oxford" price="$185.00" img1="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600" img2="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600" />
                        <ProductCard badge="-20% SALE" name="Roughneck Field Boot" price="$240.00" isSale img1="https://images.unsplash.com/photo-1520639889410-d65c36fcc9ca?q=80&w=600" img2="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=600" />
                        <ProductCard name="Veloce Sport Runner" price="$160.00" img1="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600" img2="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=600" />
                        <ProductCard badge="New" name="Aero Prime Low" price="$145.00" img1="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600" img2="https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600" />
                    </div>
                </div>
            </section>

            {/* 4. CATEGORIES GRID */}
            <section className="category-full-grid">
                <CategoryItem title="Boots" img="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800" />
                <CategoryItem title="Sneakers" img="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800" />
                <CategoryItem title="Formal" img="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800" />
            </section>

            {/* 5. MID-SEASON SALE (PARALLAX) */}
            <section className="parallax-section">
                <div className="parallax-content reveal-on-scroll">
                    <span className="hero-tag">Mid-Season Sale</span>
                    <h2 className="parallax-title">Up to 40% Off Selection</h2>
                    <p className="parallax-text">Upgrade your footwear game with our curated selection of premium leather boots.</p>
                    <button className="btn-solid">Shop the Sale</button>
                </div>
            </section>

            {/* 6. QUICK CATALOG WITH FILTERS */}
            <section className="section-padding bg-light">
                <div className="container">
                    <h2 className="display-title mb-16 reveal-on-scroll">Quick Catalog</h2>
                    <div className="catalog-layout">
                        <aside className="filters-sidebar reveal-on-scroll">
                            <div className="filter-group">
                                <h4>Color</h4>
                                <div className="color-dots">
                                    <button className="dot black"></button>
                                    <button className="dot brown"></button>
                                    <button className="dot gray"></button>
                                    <button className="dot navy"></button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4>Size</h4>
                                <div className="size-grid">
                                    {['7','8','9','10','11','12'].map(s => <button key={s} className={s === '9' ? 'active' : ''}>{s}</button>)}
                                </div>
                            </div>
                        </aside>
                        
                        <div className="products-grid reveal-on-scroll">
                            <ProductCard name="Carbon Racer" price="$215.00" img1="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600" />
                            <ProductCard name="Lexington Monk" price="$295.00" img1="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600" />
                            <ProductCard name="Summit Hiker" price="$320.00" img1="https://images.unsplash.com/photo-1520639889410-d65c36fcc9ca?q=80&w=600" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. FOOTER INFO & SERVICES */}
            <section className="services-bar">
                <div className="container service-items">
                    <div className="service"><span className="material-symbols-outlined">local_shipping</span><p>Express Global Shipping</p></div>
                    <div className="service border-x"><span className="material-symbols-outlined">verified_user</span><p>Premium 2-Year Warranty</p></div>
                    <div className="service"><span className="material-symbols-outlined">published_with_changes</span><p>Easy 30-Day Returns</p></div>
                </div>
            </section>

            <footer className="footer">
                <p>© 2026 BREINS STORE. Crafted for the Modern Explorer.</p>
            </footer>
        </div>
    );
};

/* Mini Componentes para Limpieza */
const ProductCard = ({ badge, name, price, img1, img2, isSale }) => (
    <div className="product-card group">
        <div className="img-container">
            <img src={img1} alt={name} className="main-img" />
            {img2 && <img src={img2} alt={name} className="hover-img" />}
            {badge && <div className={`badge ${isSale ? 'sale' : ''}`}>{badge}</div>}
            <button className="add-cart-btn">Add to Cart</button>
        </div>
        <h3 className="prod-name">{name}</h3>
        <p className="prod-price">{price}</p>
    </div>
);

const CategoryItem = ({ title, img }) => (
    <div className="cat-item reveal-on-scroll">
        <img src={img} alt={title} />
        <div className="cat-overlay">
            <h3>{title}</h3>
            <span className="explore-btn">EXPLORE CATEGORY</span>
        </div>
    </div>
);

export default Home;