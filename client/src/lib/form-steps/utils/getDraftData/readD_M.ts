import { API_PATHS } from "@dai0413/myorg-shared";
import { AxiosInstance } from "axios";
import { ReadFun, ReadMap } from "./types";
import { DraftData } from "../../../../types/form";
import { createItemBase } from "../../../api";

const readMatch: ReadFun<"match"> = async (
  api: AxiosInstance,
  cardId: string,
) =>
  createItemBase<DraftData[any]["match"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.MATCH,
    data: { cardId: cardId },
  });

const readPlayerAppearance: ReadFun<"playerAppearance"> = async (
  api: AxiosInstance,
  cardId: string,
) =>
  createItemBase<DraftData[any]["playerAppearance"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.PLAYER_APPEARANCE,
    data: { cardId: cardId },
  });

const readPlayerMatchEventLog: ReadFun<"playerMatchEventLog"> = async (
  api: AxiosInstance,
  cardId: string,
) =>
  createItemBase<DraftData[any]["playerMatchEventLog"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.PLAYER_MATCH_EVENT_LOG,
    data: { cardId: cardId },
  });

const readStaffAppearance: ReadFun<"staffAppearance"> = async (
  api: AxiosInstance,
  cardId: string,
) =>
  createItemBase<DraftData[any]["staffAppearance"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.STAFF_APPEARANCE,
    data: { cardId: cardId },
  });

const readStaffMatchEventLog: ReadFun<"staffMatchEventLog"> = async (
  api: AxiosInstance,
  cardId: string,
) =>
  createItemBase<DraftData[any]["staffMatchEventLog"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.STAFF_MATCH_EVENT_LOG,
    data: { cardId: cardId },
  });

const readRefereeAppearance: ReadFun<"refereeAppearance"> = async (
  api: AxiosInstance,
  cardId: string,
) =>
  createItemBase<DraftData[any]["refereeAppearance"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.REFEREE_APPEARANCE,
    data: { cardId: cardId },
  });

export const readD_MMap: ReadMap = {
  match: readMatch,
  playerAppearance: readPlayerAppearance,
  playerMatchEventLog: readPlayerMatchEventLog,
  staffAppearance: readStaffAppearance,
  staffMatchEventLog: readStaffMatchEventLog,
  refereeAppearance: readRefereeAppearance,
};
