type SuccessReturn<DATA> = {
  success: true;
  data: DATA;
};
type FailedReturn = {
  success: false;
  error: string;
};

type Result<DATA> = SuccessReturn<DATA> | FailedReturn;

type ResDataBase<DATA> = {
  data: DATA;
};

type FailedItem<DATA> = {
  _id?: string;
  data: DATA;
  error: string;
};

type BulkResult<DATA> = {
  totalCount: number;
  successCount: number;
  failedCount: number;
  modifiedCount: number;
  failedItems: FailedItem<DATA>[];
};

// read
export type ReadItemResponse<DATA> = ResDataBase<DATA>;
export type ReadItemsResponse<DATA> = ResDataBase<DATA> & {
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
export type UpdateItemsResponse<DATA> = Result<DATA> & {
  message: string;
} & BulkResult<DATA>;

// delete
export type DeleteItemResponse = {
  success: boolean;
  message: string;
};
