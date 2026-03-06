import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
    const msgGeneral = encodeURIComponent("Hola BREINS STORE, me gustaría recibir más información.");
    const msgSoporte = encodeURIComponent("Hola, tengo un inconveniente con mi pedido y necesito soporte técnico.");

    return (
        <>
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

            <footer className="main-footer">
                <div className="container footer-grid">
                    
                    <div className="footer-col">
                        <h2 className="footer-logo">BREINS <span>STORE</span></h2>
                        <p className="footer-text">
                            Nuestro asistente resolverá tus dudas. Estamos en línea de lunes a domingo de 9:00 h / 18:30 h.
                        </p>
                        <a href={`https://wa.me/573125097425?text=${msgGeneral}`} className="whatsapp-footer" target="_blank" rel="noreferrer">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
                            <div className="wa-text">
                                <span>WhatsApp (Solo Mensajes)</span>
                                <strong>573125097425</strong>
                            </div>
                        </a>
                    </div>

                    <div className="footer-col">
                        <h4>TIENDA</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/?category=shoes">Zapatos</Link></li>
                            <li><Link to="/?category=clothing">Ropa</Link></li>
                            <li><Link to="/?category=sale">Ofertas</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>INFORMACIÓN Y POLÍTICAS</h4>
                        <div className="footer-text-block">
                            <p className="footer-text">
                                Esta tienda opera bajo la plataforma de <strong>Shopify</strong>, garantizando estándares internacionales de seguridad y protección de datos.
                            </p>
                            
                            <div className="footer-support-box">
                                <p className="footer-text">
                                    <strong>¿Tienes algún problema?</strong>
                                </p>
                                <p className="footer-text">
                                    Ante cualquier inconveniente con tu pedido o duda sobre nuestras políticas, contáctanos directamente por nuestro 
                                    <a href={`https://wa.me/573125097425?text=${msgSoporte}`} target="_blank" rel="noreferrer" className="inline-wa"> WhatsApp de soporte</a>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>MEDIOS DE PAGO</h4>
                        <p className="footer-text">
                            Paga seguro con tu cuenta de Mercado Pago / Mercado Libre, tarjetas de crédito o débito a través de PSE.
                        </p>
                        <div className="payment-methods">
                            <img src="/mercadopago.png" alt="Mercado Pago" className="pay-img mp-logo" />
                            <img src="/visa.png" alt="Visa" className="visa" />
                            <img src="/mastercard.png" alt="Mastercard" className="pay-img" />
                            <img src="/bancolombia.png" alt="Bancolombia" className="pay-img bank-logo" />
                        </div>
                    </div>
                </div>
            </footer>

            <footer className="footer-bottom">
                <div className="container footer-content">
                    <p>© 2026 BREINS STORE. </p>
                    <div className="developer-tag">
                        Desarrollado por <span className="kaal-brand">KAAL</span>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;