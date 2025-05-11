export interface Calendar {
  id: string;
  companyId: string;
  propertyId: string;
  name: string;
  startDt: string;
  endDt: string;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteBy: string;
  deleteDt?: string;
  propertyName: string;
  createName: string;
  updateName: string;
  deleteName: string;
}
