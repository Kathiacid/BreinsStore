import React, { useMemo, useState } from "react";
import "./cart.css";

const WHATSAPP_PHONE = "569XXXXXXXX"; // ✅ sin "+"

const formatCOP = (value) => {
  const n = Number(value || 0);
  return n.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const Cart = ({ isOpen, onClose, cartItems, onRemoveItem }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    direccion: "",
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const { totalFinal, totalNormal, ahorroTotal } = useMemo(() => {
    const totalFinalCalc = cartItems.reduce((acc, item) => acc + Number(item.price || 0), 0);

    const totalNormalCalc = cartItems.reduce((acc, item) => {
      const normal = item.originalPrice != null ? Number(item.originalPrice) : Number(item.price || 0);
      return acc + normal;
    }, 0);

    const ahorro = Math.max(0, totalNormalCalc - totalFinalCalc);

    return {
      totalFinal: totalFinalCalc,
      totalNormal: totalNormalCalc,
      ahorroTotal: ahorro,
    };
  }, [cartItems]);

  const canCheckout = cartItems.length > 0;

  const validateForm = () => {
    if (!formData.nombre.trim()) return "Completa tu Nombre.";
    if (!formData.apellidos.trim()) return "Completa tus Apellidos.";
    if (!formData.direccion.trim()) return "Completa tu Dirección de entrega.";
    return null;
  };

  const buildWhatsappMessage = () => {
    const lines = [];

    lines.push("Hola! Quiero obtener estos productos:");
    lines.push("");
    lines.push(`Nombre: ${formData.nombre}`);
    lines.push(`Apellidos: ${formData.apellidos}`);
    lines.push(`Dirección de entrega: ${formData.direccion}`);
    lines.push("");

    lines.push("Producto(s):");

    cartItems.forEach((item, idx) => {
      const normal = item.originalPrice != null ? Number(item.originalPrice) : Number(item.price || 0);
      const final = Number(item.price || 0);
      const isOffer = item.originalPrice != null && normal > final;

      lines.push(`${idx + 1}. ${item.name}`);
      if (isOffer) {
        lines.push(`   Precio normal: ${formatCOP(normal)}`);
        lines.push(`   Precio oferta: ${formatCOP(final)}`);
      } else {
        lines.push(`   Precio: ${formatCOP(final)}`);
      }
    });

    lines.push("");
    lines.push("Resumen:");
    lines.push(`Ahorro total por ofertas: ${formatCOP(ahorroTotal)}`);
    lines.push(`Total a pagar: ${formatCOP(totalFinal)}`);
    lines.push("");
    lines.push("Nota: El precio de envío se confirmará al concretar la compra.");

    return lines.join("\n");
  };

  const openPreview = () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }
    setIsPreviewOpen(true);
  };

  const sendToWhatsapp = () => {
    const msg = buildWhatsappMessage();
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsPreviewOpen(false);
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={onClose}></div>

      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Tu Bolsa ({cartItems.length})</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            {cartItems.length === 0 ? (
              <p className="empty-msg">Tu carrito está vacío.</p>
            ) : (
              cartItems.map((item, index) => {
                const normal = item.originalPrice != null ? Number(item.originalPrice) : Number(item.price || 0);
                const final = Number(item.price || 0);
                const isOffer = item.originalPrice != null && normal > final;

                return (
                  <div key={index} className="cart-item">
                    <div className="cart-item-img">
                      <img src={item.img} alt={item.name} />
                    </div>

                    <div className="cart-item-info">
                      <h4>{item.name}</h4>

                      {isOffer ? (
                        <div className="price-block">
                          <p className="item-price old-price">{formatCOP(normal)}</p>
                          <p className="item-price">{formatCOP(final)}</p>
                        </div>
                      ) : (
                        <p className="item-price">{formatCOP(final)}</p>
                      )}

                      <button className="remove-btn" onClick={() => onRemoveItem(item.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {canCheckout && (
            <div className="checkout-form-section">
              <h4>Datos de Envío</h4>
              <form className="cart-form">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Apellidos</label>
                  <input type="text" name="apellidos" value={formData.apellidos} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Dirección de entrega</label>
                  <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} />
                </div>
              </form>
            </div>
          )}
        </div>

        {canCheckout && (
          <div className="cart-footer">
            <div className="total-row savings-row">
              <span>Ahorro por ofertas</span>
              <span className="savings-price">{formatCOP(ahorroTotal)}</span>
            </div>

            <div className="total-row">
              <span>Total</span>
              <span className="total-price">{formatCOP(totalFinal)}</span>
            </div>

            <button className="checkout-btn" onClick={openPreview}>
              Obtener por WhatsApp
            </button>

            <small className="shipping-note">El precio de envío se confirmará al concretar la compra.</small>
          </div>
        )}
      </div>

      {isPreviewOpen && (
        <div className="preview-overlay" onClick={() => setIsPreviewOpen(false)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h4>Vista previa del mensaje</h4>
              <button className="close-btn" onClick={() => setIsPreviewOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="preview-body">
              <div className="preview-summary">
                <p><strong>Nombre:</strong> {formData.nombre}</p>
                <p><strong>Apellidos:</strong> {formData.apellidos}</p>
                <p><strong>Dirección:</strong> {formData.direccion}</p>
              </div>

              <div className="preview-items">
                <h5>Productos</h5>
                {cartItems.map((item, idx) => {
                  const normal = item.originalPrice != null ? Number(item.originalPrice) : Number(item.price || 0);
                  const final = Number(item.price || 0);
                  const isOffer = item.originalPrice != null && normal > final;

                  return (
                    <div key={idx} className="preview-item">
                      <div className="preview-item-title">{idx + 1}. {item.name}</div>
                      {isOffer ? (
                        <div className="preview-prices">
                          <div>Normal: <span className="old-price">{formatCOP(normal)}</span></div>
                          <div>Oferta: <strong>{formatCOP(final)}</strong></div>
                          <div>Ahorras: <strong>{formatCOP(normal - final)}</strong></div>
                        </div>
                      ) : (
                        <div className="preview-prices">
                          <div>Precio: <strong>{formatCOP(final)}</strong></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="preview-totals">
                <div className="total-row savings-row">
                  <span>Ahorro total por ofertas</span>
                  <span className="savings-price">{formatCOP(ahorroTotal)}</span>
                </div>
                <div className="total-row">
                  <span>Total a pagar</span>
                  <span className="total-price">{formatCOP(totalFinal)}</span>
                </div>
                <p className="shipping-note">El precio de envío se confirmará al concretar la compra.</p>
              </div>

              <div className="preview-message">
                <h5>Mensaje (lo que se enviará)</h5>
                <textarea readOnly value={buildWhatsappMessage()} />
              </div>
            </div>

            <div className="preview-footer">
              <button className="btn-secondary" onClick={() => setIsPreviewOpen(false)}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={sendToWhatsapp}>
                Aceptar y abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
