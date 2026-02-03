import React, { useState } from 'react';
import './cart.css';

const Cart = ({ isOpen, onClose, cartItems, onRemoveItem }) => {
    // Estado local para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        direccion: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Calcular el total
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <>
            {/* Overlay Oscuro (Cierra el carrito al hacer click fuera) */}
            <div 
                className={`cart-overlay ${isOpen ? 'open' : ''}`} 
                onClick={onClose}
            ></div>

            {/* Panel Lateral */}
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                
                {/* Header del Carrito */}
                <div className="cart-header">
                    <h3>Tu Bolsa ({cartItems.length})</h3>
                    <button className="close-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Contenido Scrollable */}
                <div className="cart-content">
                    
                    {/* Lista de Productos */}
                    <div className="cart-items-section">
                        {cartItems.length === 0 ? (
                            <p className="empty-msg">Tu carrito está vacío.</p>
                        ) : (
                            cartItems.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <div className="cart-item-img">
                                        <img src={item.img} alt={item.name} />
                                    </div>
                                    <div className="cart-item-info">
                                        <h4>{item.name}</h4>
                                        <p className="item-price">${item.price.toLocaleString()}</p>
                                        <button 
                                            className="remove-btn"
                                            onClick={() => onRemoveItem(item.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Formulario de Checkout (Solo visible si hay productos) */}
                    {cartItems.length > 0 && (
                        <div className="checkout-form-section">
                            <h4>Datos de Envío</h4>
                            <form className="cart-form">
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input 
                                        type="text" 
                                        name="nombre" 
                                        value={formData.nombre} 
                                        onChange={handleInputChange}
                                        placeholder="Ej. Juan"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Apellidos</label>
                                    <input 
                                        type="text" 
                                        name="apellidos" 
                                        value={formData.apellidos} 
                                        onChange={handleInputChange}
                                        placeholder="Ej. Pérez"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Dirección de entrega</label>
                                    <input 
                                        type="text" 
                                        name="direccion" 
                                        value={formData.direccion} 
                                        onChange={handleInputChange}
                                        placeholder="Calle, Número, Comuna"
                                    />
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Footer Fijo (Total y Botón) */}
                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="total-row">
                            <span>Total</span>
                            <span className="total-price">${total.toLocaleString()}</span>
                        </div>
                        <button className="checkout-btn">
                            Confirmar Pedido
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;