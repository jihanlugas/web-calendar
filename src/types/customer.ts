import { Paging } from "./pagination";


export declare interface CustomerView {
  id: number;
  companyId: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt?: string;
  companyName: string;
  createName: string;
  updateName: string;
}

export declare interface CreateCustomer {
  companyId: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
}


export declare interface UpdateCustomer {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export declare interface PageCustomer extends Paging {
  companyId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  companyName?: string;
  createName?: string;
  search?: string;
  preloads?: string;
  startDt?: string | DateConstructor;
  endDt?: string | DateConstructor;
}