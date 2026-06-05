import { API_PATHS } from "@dai0413/myorg-shared";
import { ReadFun, ReadMap } from "../types";
import { DraftData } from "../../../../../types/form";
import { createItemBase } from "../../../../api";

const readPositions: ReadFun<"positions"> = async (api, readParams) =>
  createItemBase<DraftData[any]["positions"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.SN_M.POSITION,
    data: readParams,
  });

export const readSN_MMap: ReadMap = {
  positions: readPositions,
};
