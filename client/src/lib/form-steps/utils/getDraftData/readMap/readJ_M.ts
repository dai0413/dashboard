import { API_PATHS } from "@dai0413/myorg-shared";
import { ReadFun, ReadMap } from "../types";
import { DraftData } from "../../../../../types/form";
import { createItemBase } from "../../../../api";

const baseRoute = API_PATHS.GET_NEW_DATA.J_M;

export const readValues: ReadFun<"values"> = async (api, readParams) =>
  createItemBase<DraftData>({
    apiInstance: api,
    // backendRoute: baseRoute.VALUES,
    backendRoute: "/get-new-data/j-m/values",
    data: readParams,
  });

const readMatch: ReadFun<"match"> = async (api, readParams) =>
  createItemBase<DraftData[any]["match"]>({
    apiInstance: api,
    // backendRoute: baseRoute.MATCH,
    backendRoute: "/get-new-data/j-m/match",
    data: readParams,
  });

const readPlayerAppearance: ReadFun<"playerAppearance"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["playerAppearance"]>({
    apiInstance: api,
    // backendRoute: baseRoute.PLAYER_APPEARANCE,
    backendRoute: "/get-new-data/j-m/player-appearance",
    data: readParams,
  });

const readPlayerMatchEventLog: ReadFun<"playerMatchEventLog"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["playerMatchEventLog"]>({
    apiInstance: api,
    // backendRoute: baseRoute.PLAYER_MATCH_EVENT_LOG,
    backendRoute: "/get-new-data/j-m/player-match-event-log",
    data: readParams,
  });

const readStaffAppearance: ReadFun<"staffAppearance"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["staffAppearance"]>({
    apiInstance: api,
    // backendRoute: baseRoute.STAFF_APPEARANCE,
    backendRoute: "/get-new-data/j-m/staff-appearance",
    data: readParams,
  });

const readRefereeAppearance: ReadFun<"refereeAppearance"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["refereeAppearance"]>({
    apiInstance: api,
    // backendRoute: baseRoute.REFEREE_APPEARANCE,
    backendRoute: "/get-new-data/j-m/referee-appearance",
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
