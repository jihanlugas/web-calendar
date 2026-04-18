import { Paging } from "@/types/pagination";
import { PropertyView } from "./property";
import { CompanypaymentmethodView } from "./companypaymentmethod";

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
  companypaymentmethods?: CompanypaymentmethodView[];
}

export declare interface PageCompany extends Paging{
  name: string;
  description: string;
  createName: string;
}