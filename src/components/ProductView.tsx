import React from 'react';
import type { Product } from '../types';
import { ArrowLeft, Barcode, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

interface ProductViewProps {
    product: Product;
    onBack: () => void;
}

export const ProductView: React.FC<ProductViewProps> = ({ product, onBack }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    // Build the slides array
    const slides = [];
    if (product.image1_url) slides.push({ type: 'img', url: product.image1_url });
    if (product.image2_url) slides.push({ type: 'img', url: product.image2_url });

    if (product.video_url) {
        let videoUrl = product.video_url;
        // Convert YouTube Shorts URL to embed URL
        if (videoUrl.includes('youtube.com/shorts/')) {
            videoUrl = videoUrl.replace('youtube.com/shorts/', 'youtube.com/embed/');
        }
        slides.push({ type: 'video', url: videoUrl });
    }

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            <header style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                backgroundColor: 'rgba(28, 28, 28, 0.8)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        padding: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--color-text-primary)',
                        borderRadius: '50%'
                    }}
                >
                    <ArrowLeft size={22} />
                </button>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <span style={{ fontWeight: 600, fontSize: '18px', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {product.name}
                    </span>
                </div>
            </header>

            <main className="container" style={{ gap: '24px', paddingBottom: '40px' }}>

                {/* Unified Media Carousel */}
                {slides.length > 0 && (
                    <div className="embla" ref={emblaRef} style={{ position: 'relative' }}>
                        <div className="embla__container">
                            {slides.map((slide, index) => (
                                <div className="embla__slide" key={index}>
                                    {slide.type === 'img' ? (
                                        <img src={slide.url} alt={`Mídia ${index + 1}`} />
                                    ) : (
                                        <div style={{ width: '100%', height: '400px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <iframe
                                                src={slide.url}
                                                style={{ width: '100%', height: '100%', border: 'none' }}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Carousel Navigation Buttons if multiple items */}
                        {slides.length > 1 && (
                            <>
                                <button
                                    onClick={() => emblaApi?.scrollPrev()}
                                    style={{
                                        position: 'absolute',
                                        left: '8px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        padding: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white'
                                    }}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => emblaApi?.scrollNext()}
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        padding: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white'
                                    }}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Details Section */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <h1 style={{ fontSize: '24px', margin: 0 }}>{product.name}</h1>
                        <span className="badge">
                            <Barcode size={14} style={{ marginRight: '6px' }} /> GTIN: {product.gtin13}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                        <Info size={16} /> <span style={{ fontSize: '14px', fontWeight: 500 }}>DETALHES DO PRODUTO</span>
                    </div>

                    <p style={{ lineHeight: 1.7, color: 'var(--color-text-primary)', opacity: 0.9 }}>
                        {product.description}
                    </p>
                </div>
            </main>
        </div>
    );
};
