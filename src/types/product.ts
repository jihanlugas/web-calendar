import { Paging } from "@/types/pagination";
import { CompanyView } from "@/types/company";

export declare interface ProductView {
  id: string;
  companyId: string;
  name: string;
  description: string;
  price: number;
  photoId: string;
  photoUrl: string;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt: string;
  companyName: string;
  createName: string;
  updateName: string;
  company?: CompanyView;
}

export declare interface PageProduct extends Paging {
  companyId?: string;
  name?: string;
  description?: string;
  companyName?: string;
  createName?: string;
  company?: string;
  preloads?: string;
  startDt?: string | DateConstructor;
  endDt?: string | DateConstructor;
}

export declare interface CreateProduct {
  companyId: string;
  name: string;
  description: string;
  price: string | number;
}

export declare interface UpdateProduct {
  name: string;
  description: string;
  price: string | number;
}