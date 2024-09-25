export type Product = {
    id: number;
    product_name: string;
    category_id: number;
    description: string;
    price: number;
    unit_calc: string;
    inventory_quantity: number;
    warehouse_latest: string;
    quantity_warehouse_latest: number;
    createdAt: string;
    updatedAt: string;
    category: Category
}

export type Category = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PurchaseOrder {
    id: number;
    product_id: string;
    quantity: string;
    unit_price: string;
    total_price: string;
    supplier_id: string;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}