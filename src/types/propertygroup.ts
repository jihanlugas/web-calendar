export interface Propertygroup {
  id: string;
  companyId: string;
  name: string;
  description: string;
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
}

export declare interface CreatePropertygroup {
  companyId: string;
  propertyId: string;
  name: string;
  description: string;
}

export declare interface UpdatePropertygroup {
  name: string;
  description: string;
}