import React, { useEffect, useState, useCallback } from 'react';
import './ReelsSection.css';

const IG_BUSINESS_ID = "17841457832604406"; 
const ACCESS_TOKEN = "EAARWTnH5aegBQz2nZCmjyXCJUXLmOZAQ6fIPal71royKT6anueTkj4QkPURZA2AEIqxJIHDidMhZC3egAV4p0RVvRmb2LgnZCqRkSrOVOrcJZAsQ8odnizr1qgZAuMpQZBGU52HMLqRF4Trn6wyxXhlftQgLXyeZB2PXhjz8JsFxpTckszUQCMvArmHfHCvT09AZDZD"; 

const ReelsSection = () => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInstagramReels = useCallback(async () => {
        if (!ACCESS_TOKEN || !IG_BUSINESS_ID) {
            setReels(MOCK_REELS);
            setLoading(false);
            return;
        }

        try {
            const url = `https://graph.facebook.com/v21.0/${IG_BUSINESS_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${ACCESS_TOKEN}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result.data) {
                const onlyReels = result.data
                    .filter(item => item.media_type === 'VIDEO')
                    .slice(0, 6); 
                setReels(onlyReels);
            }
        } catch (error) {
            console.error("Error cargando Reels:", error);
            setReels(MOCK_REELS);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInstagramReels();
    }, [fetchInstagramReels]);

    const handleMouseEnter = (e) => {
        const video = e.currentTarget.querySelector('video');
        if (video) video.play().catch(() => {});
    };

    const handleMouseLeave = (e) => {
        const video = e.currentTarget.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    };

    return (
        <section className="reels-section">
            <div className="reels-header">
                <h2 className="reels-title">Nuestro feed</h2>
                <p className="reels-subtitle">@BREINS_STORE</p>
            </div>

            <div className="reels-grid">
                {reels.map((reel) => (
                    <a 
                        key={reel.id} 
                        href={reel.permalink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`reel-card ${loading ? 'skeleton' : ''}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <video
                            className="reel-video"
                            src={reel.media_url}
                            poster={reel.thumbnail_url}
                            muted 
                            loop
                            playsInline
                        />
                        <div className="video-shield"></div>
                        <div className="reel-overlay">
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

const MOCK_REELS = [
    { id: "m1", permalink: "#", media_url: "https://v.ftcdn.net/05/51/93/42/700_F_551934215_S0V0G5p8BfX5o7n8f9UvRzV8W6m3e0fO_ST.mp4", thumbnail_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500", caption: "New Drop 🔥", media_type: "VIDEO" },
];

export default ReelsSection;