import { CompanyView } from "./company";
import { Paging } from "./pagination";
import { Unit } from "./unit";
import { Propertytimeline } from "./propertytimeline";

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
  units?: Unit[];
  
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
}

export declare interface CreatePropertyUnit {
  name: string;
  description: string;  
}

export declare interface UpdateProperty {
  name: string;
  description: string;
}


