export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type BaseCrudRoutes = {
  ROOT: string;
  DETAIL: (id: string | number) => string;
  UPLOAD?: string;
  DOWNLOAD?: string;
};
