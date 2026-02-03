import React from 'react';
import './footer.css'; // Importamos sus propios estilos

const Footer = () => {
    return (
        <>
            {/* SERVICES BAR */}
            <section className="services-bar">
                <div className="container service-items">
                    <div className="service">
                        <span className="material-symbols-outlined">local_shipping</span>
                        <p>Envíos a todo el país</p>
                    </div>
                    <div className="service border-x">
                        <span className="material-symbols-outlined">verified_user</span>
                        <p>Garantía de Calidad</p>
                    </div>
                    <div className="service">
                        <span className="material-symbols-outlined">published_with_changes</span>
                        <p>Devoluciones Fáciles</p>
                    </div>
                </div>
            </section>

            {/* MAIN FOOTER */}
            <footer className="footer">
                <div className="container footer-content">
                    <p>© 2026 BREINS STORE. Crafted for the Modern Explorer.</p>
                    <div className="developer-tag">
                        Desarrollado por <span className="kaal-brand">KAAL</span>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;