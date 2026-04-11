import { CompanyView } from "./company";
import { OrderView } from "./order";
import { PaymentmethodView } from "./paymentmethod";

export declare interface OrderpaymentView {
    id: string;
    companyId: string;
    orderId: string;
    paymentmethodId: string;
    total: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    deleteDt?: string;
    orderName: string;
    paymentmethodName: string;
    createName: string;
    updateName: string;
    
    company?: CompanyView;
    order?: OrderView;
    paymentmethod?: PaymentmethodView;

}