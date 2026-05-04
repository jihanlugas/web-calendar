import { CompanyView } from "./company";
import { OrderView } from "./order";
import { ProductView } from "./product";


export declare interface OrderproductView {
    id: string;
    companyId: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    total: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    deleteDt?: string;
    orderName: string;
    productName: string;
    createName: string;
    updateName: string;

    company?: CompanyView;
    order?: OrderView;
    product?: ProductView;
}