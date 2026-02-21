import { CompanyView } from "./company";
import { PropertyView } from "./property";

export declare interface PropertypriceView {
  id: string;
  companyId: string;
  propertyId: string;
  priority: number;
  weekdays: any; // datatypes.JSON in Go
  startTime?: string; // *time.Time in Go
  endTime?: string; // *time.Time in Go
  price: number; // int64 in Go, but using number in TypeScript
  createBy: string;
  createDt: string; // time.Time in Go
  updateBy: string;
  updateDt: string; // time.Time in Go
  deleteDt?: string; // gorm.DeletedAt in Go
  companyName: string;
  propertyName: string;
  createName: string;
  updateName: string;
  startTimeFormated: string;
  endTimeFormated: string;

  company?: CompanyView;
  property?: PropertyView;
}

export declare interface CreatePropertyprice {
  id: string; // for smooth integration with dnd-kit not used in backend
  companyId: string;
  propertyId: string;
  priority: number;
  weekdays: any;
  startTime?: string;
  endTime?: string;
  price: number | string;
}