import { CompanyView } from "./company";
import { OrderView } from "./order";
import { TaxView } from "./tax";

export declare interface OrdertaxView {
    id: string;
    companyId: string;
    orderId: string;
    taxId: string;
    total: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    deleteDt?: string;
    orderName: string;
    taxName: string;
    createName: string;
    updateName: string;

    company?: CompanyView;
    order?: OrderView;
    tax?: TaxView;
}
