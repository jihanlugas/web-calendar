import { CompanyView } from "./company";
import { PaymentmethodView } from "./paymentmethod";

export declare interface CompanypaymentmethodView {
    id: string;
    companyId: string;
    paymentmethodId: string;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    deleteDt?: string;
    companyName: string;
    paymentmethodName: string;
    createName: string;
    updateName: string;
    
    company?: CompanyView;
    paymentmethod?: PaymentmethodView;
}