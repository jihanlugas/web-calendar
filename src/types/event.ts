import { Moment } from "moment";
import { CompanyView } from "./company";
import { PropertyView } from "./property";


export declare interface EventView {
  id: string;
  companyId: string;
  propertyId: string;
  unitId: string;
  name: string;
  description: string;
  startDt: Moment;
  endDt: Moment;
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
}