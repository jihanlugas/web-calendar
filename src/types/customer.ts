

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