import { CompanyView } from "./company";
import { OrderView } from "./order";
import { PaymentmethodView } from "./paymentmethod";

export declare interface OrderpaymentView {
    id: string;
    companyId: string;
    orderId: string;
    companypaymentmethodId: string;
    name: string;
    total: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    deleteDt?: string;
    orderName: string;
    createName: string;
    updateName: string;
    
    company?: CompanyView;
    order?: OrderView;
    paymentmethod?: PaymentmethodView;
}

export declare interface CreateOrderpayment {
    companyId: string;
    orderId: string;
    companypaymentmethodId: string;
    name: string;
    total: string | number;
}