import { Moment } from "moment";
import { CompanyView } from "./company";
import { PropertyView } from "./property";
import { OrdereventView } from "./orderevent";
import { OrderView } from "./order";


export declare interface EventView {
  id: string;
  companyId: string;
  propertyId: string;
  unitId: string;
  orderId: string;
  ordereventId: string;
  name: string;
  description: string;
  startDt: Moment;
  endDt: Moment;
  price: number;
  status: string;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt?: string;
  companyName: string;
  propertyName: string;
  unitName: string;
  createName: string;
  updateName: string;

  company?: CompanyView;
  unit?: PropertyView;
  order?: OrderView;
  orderevent?: OrdereventView;

  // property?: UnitView;
}

export declare interface EventNew {
  companyId: string;
  propertyId: string;
  unitId: string;
  name: string;
  description: string;
  startDt: string | Date ;
  endDt: string | Date ;
  status: string
  price: string | number;
}