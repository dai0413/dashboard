import { API_PATHS } from "@dai0413/myorg-shared";
import { ReadFun, ReadMap } from "../types";
import { DraftData } from "../../../../../types/form";
import { createItemBase } from "../../../../api";

const baseRoute = API_PATHS.GET_NEW_DATA.J_M;

export const readValues: ReadFun<"values"> = async (api, readParams) =>
  createItemBase<DraftData>({
    apiInstance: api,
    backendRoute: baseRoute.VALUES,
    data: readParams,
  });

const readMatch: ReadFun<"match"> = async (api, readParams) =>
  createItemBase<DraftData[any]["match"]>({
    apiInstance: api,
    backendRoute: baseRoute.MATCH,
    data: readParams,
  });

const readPlayerAppearance: ReadFun<"playerAppearance"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["playerAppearance"]>({
    apiInstance: api,
    backendRoute: baseRoute.PLAYER_APPEARANCE,
    data: readParams,
  });

const readPlayerMatchEventLog: ReadFun<"playerMatchEventLog"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["playerMatchEventLog"]>({
    apiInstance: api,
    backendRoute: baseRoute.PLAYER_MATCH_EVENT_LOG,
    data: readParams,
  });

const readStaffAppearance: ReadFun<"staffAppearance"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["staffAppearance"]>({
    apiInstance: api,
    backendRoute: baseRoute.STAFF_APPEARANCE,
    data: readParams,
  });

const readRefereeAppearance: ReadFun<"refereeAppearance"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["refereeAppearance"]>({
    apiInstance: api,
    backendRoute: baseRoute.REFEREE_APPEARANCE,
    data: readParams,
  });

export const readJ_MMap: ReadMap = {
  values: readValues,
  match: readMatch,
  playerAppearance: readPlayerAppearance,
  playerMatchEventLog: readPlayerMatchEventLog,
  staffAppearance: readStaffAppearance,
  staffMatchEventLog: undefined,
  refereeAppearance: readRefereeAppearance,
};
