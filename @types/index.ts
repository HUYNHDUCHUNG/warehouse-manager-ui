export type Product = {
    id: number;
    code: string;
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
    code: string
    supplier_name: string
    contract: string
    email: string
    phone: string
    createdAt?: string
    updatedAt?: string
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
    user: User;
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
    product: Product;

}

export interface ExportOrder {
    id: number;
    codeExportOrder: string;
    total_price: string;
    dateExport: string;
    customerId: string;
    note?: string;
    exportOrderDetails: ExportOrderDetail[];
    isFullyAvailable: boolean;
    customer: Customer;
    status: boolean;
    user: User;
    createdAt: string;
    updatedAt: string;

}

export interface ExportOrderDetail {
    id: number;
    exportOrderId: string;
    productId: string;
    productName: string;
    quantity: string;
    unitPrice: string;
    totalPrice: string;
    isAvailable: boolean;
    availableQuantity: string,
    shortageQuantity: string;

}

export interface Customer {
    id: string;
    code: string
    fullName: string;
    contract: string;
    rolte: string;
    email: string;
    phone: string;
    type: 'corporate' | 'individual';

}

export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    contract: string;
    status: boolean;
}


export interface Incom {
    success: boolean;
    current_month: {
        year: number;
        month: number;
        income: number;
        formatted_income: string;
    };
    previous_month: {
        year: number;
        month: number;
        income: number;
        formatted_income: string;
    };
    growth_rate: string; // Nếu là chuỗi số, có thể để dạng string
    growth_direction: 'increase' | 'decrease'; // Giới hạn giá trị cho hướng tăng hoặc giảm
};
export interface AnalyticOrder {
    success: boolean;
    current_month: {
        year: number;
        month: number;
        total_orders: string;
        formatted_total: string;
        completed_orders: string;
        pending_orders: string;
        completion_rate: string;
    };
    previous_month: {
        year: number;
        month: number;
        total_orders: string;
        formatted_total: string;
    };
    growth_rate: string;
    growth_direction: 'increase' | 'decrease';
}

export interface MonthlyOrders {
    year: number;
    month: number;
    total_orders: string;
    formatted_total: string;
    completed_orders?: number;
    pending_orders?: number;
    completion_rate?: string;
}

export interface PurchaseOrdersData {
    success: boolean;
    current_month: MonthlyOrders;
    previous_month: MonthlyOrders;
    growth_rate: string;
    growth_direction: 'increase' | 'decrease';
}


export interface MonthlyCustomers {
    year: number;
    month: number;
    new_customers: string;
    formatted_new_customers: string;
}

export interface AnalyticCustomers {
    success: boolean;
    current_month: MonthlyCustomers;
    previous_month: MonthlyCustomers;
    total_customers: number;
    formatted_total: string;
    growth_rate: string;
    growth_direction: 'increase' | 'decrease' | 'stable';
}

export interface InventoryReport {
    product_name: string;          // Tên hàng hóa
    unit: string;                  // Đơn vị tính
    beginning_inventory: number;   // Tồn đầu kỳ
    quantity_imported: number;     // Số lượng nhập
    quantity_exported: number;     // Số lượng xuất
    ending_inventory: number;      // Tồn cuối kỳ
    inventory_value: number;       // Giá trị tồn kho
};