import { CompanyView } from "./company";


export declare interface DiscountView {
    id: string;
    companyId: string;
    name: string;
    description: string;
    type: string;
    value: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    deleteDt?: string;
    companyName: string;
    createName: string;
    updateName: string;
    
    company?: CompanyView;
}