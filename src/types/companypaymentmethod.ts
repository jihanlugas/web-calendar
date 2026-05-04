import { CompanyView } from "./company";
import { Paging } from "./pagination";
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

export declare interface PageCompanypaymentmethod extends Paging {
    companyId?: string;
    paymentmethodId?: string;
    companyName?: string;
    paymentmethodName?: string;
    createName?: string;
    updateName?: string;
    preloads?: string;
    startDt?: string | DateConstructor;
    endDt?: string | DateConstructor;
}