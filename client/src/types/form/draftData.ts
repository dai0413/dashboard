import { AxiosInstance } from "axios";
import { Label } from "@dai0413/myorg-shared";
import { Scraped } from "@dai0413/myorg-shared/types/j_m/values";
import { FormTypeMap } from "../models";
import { TeamMatchFormationForm } from "../models/team-match-formation";
import { PostedDraftData } from "./postedDraftData";

export type AddDraftData<K extends keyof FormTypeMap> = (args: {
  data: FormTypeMap[K] & Record<string, any>;
  metaData: Record<string, any>;
  draftData: DraftData;
  postedDraftData: PostedDraftData;
  api: AxiosInstance;
  formLabel: Record<string, any>;
}) => Promise<DraftData>;

export type GetDraftData<
  K extends keyof FormTypeMap,
  T extends boolean,
> = (args: {
  draftData: DraftData;
  postedDraftData: PostedDraftData;
  metaData: Record<string, any>;
  api: AxiosInstance;
}) => T extends true
  ? Promise<{ value: FormTypeMap[K][]; label: Record<string, any>[] } | null>
  : Promise<{ value: FormTypeMap[K]; label: Record<string, any> } | null>;

type TeamMatchFormation = Omit<TeamMatchFormationForm, "formation"> & {
  formation?: Label;
};

export type DraftDataValue = Scraped & {
  teamMatchFormation?: {
    home: TeamMatchFormation;
    away: TeamMatchFormation;
  };
};

export type DraftData = Record<string, DraftDataValue>;
