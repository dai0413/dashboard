type ResDataBase<DATA> = {
  data: DATA;
};

export type ResBody<DATA> = ResDataBase<DATA> & {
  totalCount?: number;
  page?: number;
  pageSize?: number;
};

export type APIError = {
  error?: {
    code?: number;
    message?: string;
    errors?: any;
  };
};

export type CreateResBody<DATA> = ResDataBase<DATA> & {
  message: "追加しました";
};

export type EditResBody<DATA> = ResDataBase<DATA> & {
  message: "編集しました";
};

export type DeleteResBody = {
  message: "削除しました";
};
