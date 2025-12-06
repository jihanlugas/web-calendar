import { Paging } from "@/types/pagination";
import { PropertyView } from "./property";

export declare interface CompanyView {
  id: string;
  name: string;
  description: string;
  email: string;
  phoneNumber: string;
  address: string;
  invoiceNote: string;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteBy: string;
  deleteDt?: string;
  createName: string;
  updateName: string;
  totalGor: number;
  totalPlayer: number;

  properties?: PropertyView[];
}

export declare interface PageCompany extends Paging{
  name: string;
  description: string;
  createName: string;
}