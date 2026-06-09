import { AxiosInstance } from "axios";
import { readItemsBase } from "../../../../api";
import { Formation } from "../../../../../types/models/formation";
import { API_PATHS } from "@dai0413/myorg-shared";

export const getFormation = async (
  api: AxiosInstance,
  key: string,
): Promise<{
  id: string;
  label: string;
} | null> => {
  const obj = await readItemsBase<Formation[]>({
    apiInstance: api,
    params: { key },
    backendRoute: API_PATHS.FORMATION.ROOT,
  });

  if (!obj || !obj.data) return null;

  const formations: Formation[] = obj.data;

  if (formations.length !== 1) return null;

  return { id: formations[0]._id, label: formations[0].name };
};
