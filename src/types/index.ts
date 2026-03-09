export interface Product {
    id: number;
    gtin13: string;
    name: string;
    description: string;
    image1_url?: string;
    image2_url?: string;
    video_url?: string;
    created_at: string;
    updated_at: string;
}
