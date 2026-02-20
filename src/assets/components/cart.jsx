import React, { useEffect, useState, useCallback } from "react";
import { getCart, removeFromCart, updateCartQuantity } from "../../utils/shopify";
import "./cart.css";

const Cart = ({ isOpen, onClose }) => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCartItems = useCallback(async () => {
    const cartId = localStorage.getItem("shopify_cart_id");
    if (!cartId) {
      setCartData(null); // Limpiar datos si no hay ID
      return;
    }

    setLoading(true);
    try {
      const data = await getCart();
      setCartData(data);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen, fetchCartItems]);

  useEffect(() => {
    window.addEventListener("cartUpdated", fetchCartItems);
    return () => window.removeEventListener("cartUpdated", fetchCartItems);
  }, [fetchCartItems]);

  // --- NUEVA FUNCIÓN INTEGRADA ---
  const handleCheckout = () => {
    if (cartData?.checkoutUrl) {
      // Limpiamos el ID antes de salir para que al volver 
      // la tienda esté lista para un carrito nuevo.
      localStorage.removeItem("shopify_cart_id");
      window.location.href = cartData.checkoutUrl;
    }
  };

  const handleRemove = async (lineId) => {
    setLoading(true);
    try {
      await removeFromCart(lineId);
    } catch (err) {
      console.error("Error al eliminar:", err);
      setLoading(false);
    }
  };

  const handleQtyChange = async (lineId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemove(lineId);
      return;
    }
    setLoading(true);
    try {
      await updateCartQuantity(lineId, newQty);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const lines = cartData?.lines?.edges || [];
  const totalAmount = cartData?.cost?.totalAmount?.amount || 0;
  const totalQuantity = cartData?.totalQuantity || 0;

  const totalSavings = lines.reduce((acc, { node }) => {
    const price = Number(node.merchandise.price.amount);
    const compareAt = Number(node.merchandise.compareAtPrice?.amount || price);
    return acc + (compareAt - price) * node.quantity;
  }, 0);

  const formatPrice = (val) => Number(val).toLocaleString("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0
  });

  return (
    <>
      <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        
        <div className="cart-header">
          <h3>Tu Bolsa <span>({totalQuantity})</span></h3>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="cart-content">
          {loading && lines.length === 0 ? (
            <div className="empty-msg"><p>Sincronizando con la tienda...</p></div>
          ) : lines.length === 0 ? (
            <div className="empty-msg">
              <span className="material-symbols-outlined" style={{fontSize: '48px'}}>shopping_bag</span>
              <p>Tu bolsa está vacía</p>
            </div>
          ) : (
            <div className={`cart-items-section ${loading ? 'cart-loading-active' : ''}`}>
              {lines.map(({ node }) => {
                const price = Number(node.merchandise.price.amount);
                const compareAt = Number(node.merchandise.compareAtPrice?.amount || 0);
                const hasSale = compareAt > price;

                return (
                  <div key={node.id} className="cart-item">
                    <div className="cart-item-img">
                      <img src={node.merchandise.image?.url} alt="" />
                    </div>
                    
                    <div className="cart-item-info">
                      <div className="cart-item-row" style={{display:'flex', justifyContent:'space-between'}}>
                        <h4>{node.merchandise.product.title}</h4>
                        <button className="remove-btn" onClick={() => handleRemove(node.id)}>
                            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>delete</span>
                        </button>
                      </div>
                      
                      <p className="item-variant">{node.merchandise.title}</p>

                      <div className="cart-item-price-row" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'10px'}}>
                        <div className="item-qty-selector">
                          <button onClick={() => handleQtyChange(node.id, node.quantity, -1)}>−</button>
                          <span>{node.quantity}</span>
                          <button onClick={() => handleQtyChange(node.id, node.quantity, 1)}>+</button>
                        </div>

                        <div className="item-prices" style={{textAlign: 'right'}}>
                          {hasSale && <span className="old-price" style={{fontSize:'0.8rem', textDecoration:'line-through', opacity: 0.5}}>{formatPrice(compareAt * node.quantity)}</span>}
                          <p className={`item-price ${hasSale ? "sale-red" : ""}`} style={{margin:0, fontWeight:'bold'}}>
                            {formatPrice(price * node.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="cart-footer">
            {totalSavings > 0 && (
              <div className="total-row savings-row" style={{ color: '#2e7d32', fontSize: '0.95rem', marginBottom: '8px', display:'flex', justifyContent:'space-between' }}>
                <span>Ahorro total:</span>
                <span className="savings-price">-{formatPrice(totalSavings)}</span>
              </div>
            )}
            <div className="total-row" style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'1.2rem', borderTop:'1px solid #eee', paddingTop:'15px'}}>
              <span>TOTAL ESTIMADO:</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            
            <button 
              className="checkout-btn" 
              onClick={handleCheckout} // ✅ Usando la nueva función
              style={{width:'100%', padding:'15px', background:'#1a1a1a', color:'#fff', border:'none', marginTop:'20px', cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}
            >
              FINALIZAR PEDIDO
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;