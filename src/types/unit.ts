export interface Unit {
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

export declare interface CreateUnit {
  companyId: string;
  propertyId: string;
  name: string;
  description: string;
}

export declare interface UpdateUnit {
  name: string;
  description: string;
}