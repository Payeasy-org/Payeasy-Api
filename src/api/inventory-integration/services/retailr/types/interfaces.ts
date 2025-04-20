export interface RetailrUser {
    id: number;
    location: RetailrLocation;
    username: string;
    referral_code: string;
    referral_status: string;
    is_active: boolean;
    first_name: string;
    last_name: string;
    middle_name: string;
    phone_number: string;
    profile_image: string;
    total_referral_points: number;
    user_type: string;
    service_name: string | null;
    service_metadata: Record<string, any>;
    service_type: string | null;
    email: string;
    dob: string | null;
    created_at: string;
    referred_by: string | null;
}

export interface RetailrLocation {
    id: number;
    created_at: string;
    updated_at: string;
    description: string | null;
    notes: string | null;
    meta_data: any;
    country: string;
    state_or_province: string;
    city: string;
    street: string;
    postal_code: string;
    latitude: string;
    longitude: string;
}
export interface RetailrImage {
    src: string;
    alt: string;
}
export interface RetailrInventoryItem {
    id: number;
    variant: RetailrVariant;
    branch: number;
    created_at: string;
    updated_at: string;
    notes: string | null;
    is_active: boolean;
    quantity: number;
    reorder_level: number;
    cost_price: number | null;
    original_price: string;
    discount_percentage: string;
    barcode: string | null;
    expiration_date: string | null;
    description: string | null;
    selling_price: number;
    images: RetailrImage[];
}

export interface RetailrVariant {
    id: number;
    inventory: RetailrInventory;
    categories: RetailrCategory[];
    collections: any[];
    created_at: string;
    updated_at: string;
    description: string | null;
    notes: string | null;
    name: string;
    average_cost_price: number | null;
    average_selling_price: number | null;
    sku: string | null;
    upc: string | null;
    ean: string | null;
    standard_pack_qty: number;
    standard_pack_price: number | null;
    images: string[];
}

export interface RetailrInventory {
    id: number;
    categories: RetailrCategoryWithHierarchy[];
    created_at: string;
    updated_at: string;
    description: string | null;
    notes: string | null;
    name: string;
    brand: string;
}

export interface RetailrCategory {
    id: number;
    created_at: string;
    updated_at: string;
    description: string | null;
    notes: string | null;
    name: string;
    unit: string;
}

export interface RetailrCategoryWithHierarchy {
    id: number;
    children: any | null;
    level: number;
    created_at: string;
    updated_at: string;
    description: string;
    notes: string | null;
    meta_data: any;
    name: string;
    display_cover: string | null;
    lft: number;
    rght: number;
    tree_id: number;
    parent: number | null;
}
