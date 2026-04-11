import { CompanyView } from "./company";
import { EventView } from "./event";
import { OrderdiscountView } from "./orderdiscount";
import { OrdereventView } from "./orderevent";
import { OrderpaymentView } from "./orderpayment";
import { OrderproductView } from "./orderproduct";
import { OrdertaxView } from "./ordertax";


export declare interface OrderView {
    id: string;
    companyId: string;
    tax: number;
    discount: number;
    rounding: number;
    subtotal: number;
    total: number;
    payment: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    deleteDt?: string;
    companyName: string;
    createName: string;
    updateName: string;
    company?: CompanyView;
    orderevents?: OrdereventView[];
    orderproducts?: OrderproductView[];
    ordertaxes?: OrdertaxView[];
    orderdiscounts?: OrderdiscountView[];
    orderpayments?: OrderpaymentView[];
}