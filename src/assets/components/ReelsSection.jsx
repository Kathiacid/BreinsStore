import React, { useEffect, useState } from 'react';
import './ReelsSection.css';

// ⚠️ IMPORTANTE: 
// 1. Ve a developers.facebook.com y crea una app tipo "Consumer".
// 2. Añade "Instagram Basic Display".
// 3. Genera un "User Token".
// 4. Pégalo aquí abajo entre las comillas.
const INSTAGRAM_TOKEN = ""; // <--- PEGA TU TOKEN AQUÍ

const ReelsSection = () => {
    const [reels, setReels] = useState([]);

    useEffect(() => {
        const fetchReels = async () => {
            // Si NO hay token, usamos datos de prueba para no romper el diseño
            if (!INSTAGRAM_TOKEN) {
                console.warn("Falta el Token de Instagram. Mostrando datos de prueba.");
                setReels(MOCK_REELS);
                return;
            }

            try {
                // URL oficial de Instagram API para obtener medios
                const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${INSTAGRAM_TOKEN}`;
                
                const response = await fetch(url);
                const data = await response.json();

                if (data.data) {
                    // 1. Filtramos solo VIDEO (Reels) o IMAGE si quieres todo
                    // 2. Tomamos los primeros 5
                    const onlyReels = data.data
                        .filter(item => item.media_type === 'VIDEO' || item.media_type === 'CAROUSEL_ALBUM') 
                        .slice(0, 5);
                    
                    setReels(onlyReels);
                }
            } catch (error) {
                console.error("Error cargando Reels:", error);
                setReels(MOCK_REELS); // Fallback en error
            }
        };

        fetchReels();
    }, []);

    return (
        <section className="reels-section">
            <div className="reels-header reveal-on-scroll">
                <h2 className="reels-title">On The Feed</h2>
                <p className="reels-subtitle">@BREINS_STORE</p>
            </div>

            <div className="reels-grid reveal-on-scroll">
                {reels.map((reel) => (
                    <a 
                        key={reel.id} 
                        href={reel.permalink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="reel-card"
                    >
                        {/* Instagram usa thumbnail_url para videos, media_url para imagenes */}
                        <img 
                            src={reel.thumbnail_url || reel.media_url} 
                            alt={reel.caption} 
                            className="reel-thumb" 
                            loading="lazy"
                        />
                        
                        <div className="reel-overlay">
                            <span className="material-symbols-outlined reel-icon">smart_display</span>
                            <span className="material-symbols-outlined play-icon">play_circle</span>
                            {reel.caption && (
                                <p className="reel-caption">{reel.caption}</p>
                            )}
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

// Datos falsos por si no tienes el token aún (para que veas el diseño)
const MOCK_REELS = [
    { id: 1, permalink: "#", media_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", caption: "New Drop Available 🔥", media_type: "VIDEO" },
    { id: 2, permalink: "#", media_url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&q=80", caption: "Running vibes 🏃‍♂️", media_type: "VIDEO" },
    { id: 3, permalink: "#", media_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", caption: "Red Edition ❤️", media_type: "VIDEO" },
    { id: 4, permalink: "#", media_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80", caption: "Green Force 🟢", media_type: "VIDEO" },
    { id: 5, permalink: "#", media_url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80", caption: "Street Style 2024", media_type: "VIDEO" },
];

export default ReelsSection;