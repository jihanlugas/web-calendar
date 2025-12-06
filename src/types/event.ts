import { Moment } from "moment";
import { CompanyView } from "./company";
import { PropertyView } from "./property";


export declare interface EventView {
  id: string;
  companyId: string;
  propertyId: string;
  propertygroupId: string;
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
  propertygroupName: string;
  createName: string;
  updateName: string;

  company?: CompanyView;
  propertygroup?: PropertyView;
  // property?: PropertygroupView;
}

export declare interface EventNew {
  companyId: string;
  propertyId: string;
  propertygroupId: string;
  name: string;
  description: string;
  startDt: string | Date ;
  endDt: string | Date ;
  status: string
}