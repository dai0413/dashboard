type SuccessReturn<DATA> = {
  success: true;
  data: DATA;
};
type FailedReturn = {
  success: false;
  error: string;
};

type Result<DATA> = SuccessReturn<DATA> | FailedReturn;

type BulkResult<DATA> = {
  totalCount: number;
  successCount: number;
  failedCount: number;
  failedItems: {
    _id?: string;
    data: DATA;
    error: string;
  }[];
};

// read
export type ReadItemResponse<DATA> = {
  data: DATA;
};
export type ReadItemsResponse<DATA> = {
  data: DATA;
  totalCount: number;
  page: number;
  pageSize: number;
};

// create
export type CreateItemResponse<DATA> = Result<DATA> & {
  message: string;
};
export type CreateItemsResponse<DATA> = Result<DATA> & {
  message: string;
} & BulkResult<DATA>;

// update
export type UpdateItemResponse<DATA> = Result<DATA> & {
  message: string;
};
export type UpdateItemsResponse<DATA, FAILED_DATA> = {
  data: DATA;
  success: boolean;
  message: string;
  modifiedCount: number;
} & BulkResult<FAILED_DATA>;

// delete
export type DeleteItemResponse = {
  success: boolean;
  message: string;
};
export type DeleteItemsResponse<DATA> = {
  success: boolean;
  message: string;
  deletedCount: number;
} & BulkResult<DATA>;
