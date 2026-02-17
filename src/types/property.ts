import { CompanyView } from "./company";
import { Paging } from "./pagination";
import { UnitView } from "./unit";
import { Propertytimeline } from "./propertytimeline";
import { PropertypriceView } from "./propertyprice";

export interface PropertyView {
  id: string;
  companyId: string;
  name: string;
  description: string;
  photoId: string;
  photoUrl: string;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteBy: string;
  deleteDt?: string;
  createName: string;
  updateName: string;
  deleteName: string;
  companyName: string;

  company?: CompanyView;
  propertytimeline?: Propertytimeline;
  units?: UnitView[];
  propertyprices?: PropertypriceView[];
}

export declare interface PageProperty extends Paging {
  companyId?: string;
  name?: string;
  description?: string;
  companyName?: string;
  createName?: string;
  preloads?: string;
  startDt?: string | DateConstructor;
  endDt?: string | DateConstructor;
}

export declare interface CreateProperty {
  companyId: string;
  name: string;
  description: string;
  units: CreatePropertyUnit[];
  propertyprices: CreatePropertyprice[];
}

export declare interface CreatePropertyUnit {
  name: string;
  description: string;  
}

export declare interface CreatePropertyprice {
  id: string; // for smooth integration with dnd-kit not used in backend
  priority: number;
  price: number | string;
  startTime: string;
  endTime: string;
  weekdays: number[];
}

export declare interface UpdateProperty {
  name: string;
  description: string;
}


