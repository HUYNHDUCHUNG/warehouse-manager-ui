export type Product = {
    id: number;
    product_name: string;
    category_id: number;
    description: string;
    price: number;
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