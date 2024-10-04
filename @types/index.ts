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
export interface Supplier {
    id: number
    supplier_name: string
    contract: string
    email: string
    phone: string
    createdAt: string
    updatedAt: string
}
export interface PurchaseOrder {
    id: number;
    codePurchaseOrder: string;
    total_price: string;
    dateImport: string;
    supplier_id: string;
    note?: string;
    supplier: Supplier;
    purchaseOrderDetails: PurchaseOrderDetail[];
    createdAt: Date;
    updatedAt: Date;
}

export interface PurchaseOrderDetail {
    id: number;
    purchaseOrderId: string;
    productId: string;
    quantity: string;
    unitPrice: string;
    totalPrice: string;

}

export interface ExportOrder {
    id: number;
    codeExportOrder: string;
    total_price: string;
    dateExport: string;
    customerId: string;
    note?: string;
    supplier: Supplier;
    exportOrderDetails: ExportOrderDetail[];
    isFullyAvailable: boolean;
    customer: Customer;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;

}

export interface ExportOrderDetail {
    id: number;
    exportOrderId: string;
    productId: string;
    quantity: string;
    unitPrice: string;
    totalPrice: string;
    isAvailable: boolean;
    availableQuantity: string,
    shortageQuantity: string;

}

export interface Customer {
    id: number;
    fullName: string;
    contract: string;
    email: string;
    phone: string;

}