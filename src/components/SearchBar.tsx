import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { productService } from '../services/api';
import type { Product } from '../types';

interface SearchBarProps {
    onSelectProduct: (product: Product) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectProduct }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length >= 3) {
                setIsLoading(true);
                try {
                    const res = await productService.searchProducts(query);
                    setResults(res);
                    setIsOpen(true);
                } catch (error) {
                    console.error("Error searching products:", error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        };

        // Simple debounce
        const delayDebounceFn = setTimeout(() => {
            fetchResults();
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelect = (product: Product) => {
        setQuery('');
        setIsOpen(false);
        onSelectProduct(product);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search
                    size={20}
                    color="var(--color-text-secondary)"
                    style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }}
                />
                <input
                    type="search"
                    placeholder="Pesquisar por nome ou código..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                    style={{
                        paddingLeft: '48px',
                        paddingRight: isLoading ? '40px' : '20px',
                        width: '100%'
                    }}
                />
                {isLoading && (
                    <Loader2
                        className="animate-spin"
                        size={18}
                        color="var(--color-primary)"
                        style={{ position: 'absolute', right: '16px' }}
                    />
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div
                    className="card"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        left: 0,
                        right: 0,
                        zIndex: 50,
                        padding: '8px 0',
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}
                >
                    {results.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleSelect(product)}
                            style={{
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'var(--color-dark)', flexShrink: 0 }}>
                                {product.image1_url ? (
                                    <img src={product.image1_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Search size={16} color="var(--color-text-secondary)" />
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <p style={{ margin: 0, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {product.name}
                                </p>
                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                    {product.gtin13}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isOpen && query.length >= 3 && results.length === 0 && !isLoading && (
                <div
                    className="card"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        left: 0,
                        right: 0,
                        zIndex: 50,
                        padding: '16px',
                        textAlign: 'center',
                        color: 'var(--color-text-secondary)'
                    }}
                >
                    Nenhum produto encontrado.
                </div>
            )}
        </div>
    );
};
