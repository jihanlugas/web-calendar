export declare interface PageInfo {
  pageSize: number
  pageCount: number
  totalData: number
  page: number
}

export declare interface Paging {
  page?: number
  limit?: number
  sortField?: string
  sortOrder?: string
}