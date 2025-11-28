export type BaseCrudRoutes = {
  ROOT: string;
  DETAIL: (id: string | number) => string;
  UPLOAD?: string;
  DOWNLOAD?: string;
};
