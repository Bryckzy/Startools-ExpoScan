import type { Product } from '../types';

// Mocked hardcoded product list based on PRD scenarios
const MOCK_PRODUCTS: Product[] = [
    {
        id: 1,
        gtin13: '7891024110348',
        name: 'Mini Serra Elétrica',
        description: 'A Mini Motosserra Elétrica Startools foi desenvolvida para oferecer potência, praticidade e precisão em trabalhos de poda e corte leve. Compacta e ergonômica, é ideal para cortar galhos, pequenos troncos e madeira em atividades de jardinagem e manutenção. Seu motor elétrico de alto desempenho proporciona cortes rápidos e eficientes, enquanto o design leve permite uso confortável com uma mão.',
        image1_url: 'https://res.cloudinary.com/dz0o7uk3d/image/upload/v1773077006/AR0476_04_1_hjejpl.jpg',
        image2_url: 'https://res.cloudinary.com/dz0o7uk3d/image/upload/v1773077006/AR0476_04_1_hjejpl.jpg',
        video_url: 'https://www.youtube.com/shorts/pTGiWNj-m0w',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 2,
        gtin13: '7899876543210',
        name: 'Furadeira de Impacto',
        description: 'Furadeira de impacto 800W, ideal para uso doméstico e profissional.',
        image1_url: 'https://via.placeholder.com/600x600/FFD100/111111?text=Furadeira+Impacto',
        image2_url: 'https://via.placeholder.com/600x600/111111/FFD100?text=Furadeira+Detalhe',
        // Sem video_url conforme cenário do PRD
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 3,
        gtin13: '7891112223334',
        name: 'Trena Laser 40m',
        description: 'Trena digital a laser com precisão de +- 2mm, alcança até 40 metros.',
        image1_url: 'https://via.placeholder.com/600x600/FFD100/111111?text=Trena+Laser',
        // Sem image2_url nem video_url conforme cenário do PRD
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
];

export const productService = {
    /**
     * Simulates the SQL query:
     * SELECT * FROM products WHERE gtin13 = '...' LIMIT 1;
     */
    async getProductByGtin13(gtin13: string): Promise<Product | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const product = MOCK_PRODUCTS.find(p => p.gtin13 === gtin13);
                resolve(product || null);
            }, 500); // simulate network latency
        });
    },

    /**
     * Simulates a text search on the products based on name or GTIN
     */
    async searchProducts(query: string): Promise<Product[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!query || query.length < 3) {
                    resolve([]);
                    return;
                }

                const lowerQuery = query.toLowerCase();
                const results = MOCK_PRODUCTS.filter(p =>
                    p.name.toLowerCase().includes(lowerQuery) ||
                    p.gtin13.includes(query)
                );

                resolve(results);
            }, 300); // simulate fast network latency for autocomplete
        });
    }
};
