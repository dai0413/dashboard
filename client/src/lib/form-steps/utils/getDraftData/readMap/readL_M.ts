import { API_PATHS } from "@dai0413/myorg-shared";
import { ReadFun, ReadMap } from "../types";
import { DraftData } from "../../../../../types/form";
import { createItemBase } from "../../../../api";

const baseRoute = API_PATHS.GET_NEW_DATA.L_M;

const readValues: ReadFun<"values"> = async (api, readParams) =>
  createItemBase<DraftData>({
    apiInstance: api,
    backendRoute: baseRoute.VALUES,
    data: readParams,
  });

const readPositions: ReadFun<"positions"> = async (api, readParams) =>
  createItemBase<DraftData[any]["positions"]>({
    apiInstance: api,
    backendRoute: baseRoute.POSITION,
    data: readParams,
  });

const readStatsL: ReadFun<"statsL"> = async (api, readParams) =>
  createItemBase<DraftData[any]["statsL"]>({
    apiInstance: api,
    backendRoute: baseRoute.STATS,
    data: readParams,
  });

export const readL_MMap: ReadMap = {
  values: readValues,
  positions: readPositions,
  statsL: readStatsL,
};
