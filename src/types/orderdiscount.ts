import { CompanyView } from "./company";
import { DiscountView } from "./discount";
import { OrderView } from "./order";

export declare interface OrderdiscountView {
    id: string;
    companyId: string;
    orderId: string;
    discountId: string;
    total: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    deleteDt?: string;
    orderName: string;
    discountName: string;
    createName: string;
    updateName: string;

    company?: CompanyView;
    order?: OrderView;
    discount?: DiscountView;
}