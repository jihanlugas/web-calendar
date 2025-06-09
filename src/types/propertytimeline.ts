export interface Propertytimeline {
  id: string;
  defaultStartDtValue: number;
  defaultStartDtUnit: string;
  defaultEndDtValue: number;
  defaultEndDtUnit: string;
  minZoomTimelineHour: number;
  maxZoomTimelineHour: number;
  dragSnapMin: number;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteBy: string;
  deleteDt?: string;
}
