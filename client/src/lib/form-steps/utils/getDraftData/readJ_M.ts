import { API_PATHS } from "@dai0413/myorg-shared";
import { AxiosInstance } from "axios";
import { ReadFun, ReadMap } from "./types";
import { DraftData } from "../../../../types/form";
import { createItemBase } from "../../../api";

const readMatch: ReadFun<"match"> = async (api: AxiosInstance, url: string) =>
  createItemBase<DraftData[any]["match"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.J_M.MATCH,
    data: { url: url },
  });

const readPlayerAppearance: ReadFun<"playerAppearance"> = async (
  api: AxiosInstance,
  url: string,
) =>
  createItemBase<DraftData[any]["playerAppearance"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.J_M.PLAYER_APPEARANCE,
    data: { url: url },
  });

const readPlayerMatchEventLog: ReadFun<"playerMatchEventLog"> = async (
  api: AxiosInstance,
  url: string,
) =>
  createItemBase<DraftData[any]["playerMatchEventLog"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.J_M.PLAYER_MATCH_EVENT_LOG,
    data: { url: url },
  });

const readStaffAppearance: ReadFun<"staffAppearance"> = async (
  api: AxiosInstance,
  url: string,
) =>
  createItemBase<DraftData[any]["staffAppearance"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.J_M.STAFF_APPEARANCE,
    data: { url: url },
  });

const readRefereeAppearance: ReadFun<"refereeAppearance"> = async (
  api: AxiosInstance,
  url: string,
) =>
  createItemBase<DraftData[any]["refereeAppearance"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.J_M.REFEREE_APPEARANCE,
    data: { url: url },
  });

export const readJ_MMap: ReadMap = {
  match: readMatch,
  playerAppearance: readPlayerAppearance,
  playerMatchEventLog: readPlayerMatchEventLog,
  staffAppearance: readStaffAppearance,
  staffMatchEventLog: undefined,
  refereeAppearance: readRefereeAppearance,
};
