import { API_PATHS } from "@dai0413/myorg-shared";
import { ReadFun, ReadMap } from "./types";
import { DraftData } from "../../../../types/form";
import { createItemBase } from "../../../api";

const readMatch: ReadFun<"match"> = async (api, readParams) =>
  createItemBase<DraftData[any]["match"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.MATCH,
    data: readParams,
  });

const readPlayerAppearance: ReadFun<"playerAppearance"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["playerAppearance"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.PLAYER_APPEARANCE,
    data: readParams,
  });

const readPlayerMatchEventLog: ReadFun<"playerMatchEventLog"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["playerMatchEventLog"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.PLAYER_MATCH_EVENT_LOG,
    data: readParams,
  });

const readStaffAppearance: ReadFun<"staffAppearance"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["staffAppearance"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.STAFF_APPEARANCE,
    data: readParams,
  });

const readStaffMatchEventLog: ReadFun<"staffMatchEventLog"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["staffMatchEventLog"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.STAFF_MATCH_EVENT_LOG,
    data: readParams,
  });

const readRefereeAppearance: ReadFun<"refereeAppearance"> = async (
  api,
  readParams,
) =>
  createItemBase<DraftData[any]["refereeAppearance"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.REFEREE_APPEARANCE,
    data: readParams,
  });

export const readD_MMap: ReadMap = {
  match: readMatch,
  playerAppearance: readPlayerAppearance,
  playerMatchEventLog: readPlayerMatchEventLog,
  staffAppearance: readStaffAppearance,
  staffMatchEventLog: readStaffMatchEventLog,
  refereeAppearance: readRefereeAppearance,
};
