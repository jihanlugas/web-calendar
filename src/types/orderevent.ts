import { CompanyView } from "./company";
import { EventView } from "./event";
import { OrderView } from "./order";


export declare interface OrdereventView {
  id: string;
  companyId: string;
  orderId: string;
  eventId: string;
  total: number;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt?: string;
  orderName: string;
  eventName: string;
  createName: string;
  updateName: string;

  company?: CompanyView;
  order?: OrderView;
  event?: EventView;
}