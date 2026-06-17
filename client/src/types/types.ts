import { FormTypeMap, GettedModelDataMap, ModelType } from "./models";
import { MatchGet } from "./models/match";

export type Label = {
  label: string;
  id?: string;
};

export type LinkField = {
  field: string;
  to: string;
};

export type FieldListData = Record<
  string,
  {
    value: any;
    onEdit?: () => void;
  }
>;

export type Data<D extends Record<string, any>> = {
  data: D[];
  page: number;
  totalCount: number;
  isLoading: boolean;
};

export type TeamMatch = Omit<
  MatchGet,
  | "home_team"
  | "away_team"
  | "home_goal"
  | "away_goal"
  | "home_pk_goal"
  | "away_pk_goal"
  | "result"
> & {
  team: Label;
  against_team: Label;
  goal?: number;
  against_goal?: number;
  pk_goal?: number;
  against_pk_goal?: number;
  result?: "勝ち" | "負け" | "分け";
};

export enum From {
  D_PC = "d_pc",
  D_SC = "d_sc",
  D_M = "d_m",
  D_ML = "d_ml",
  L_M = "l_m",
  J_M = "j_m",
  SN_M = "sn_m",

  NORMAL = "normal",
}

export enum InputMode {
  SINGLE = "single",
  MANY = "many",
}

export enum FormMode {
  CREATE = "create",
  UPDATE = "update",
}

export enum ViewMode {
  TABLE = "table",
  TILE = "tile",
}

export type GetStepsArgs<T extends keyof FormTypeMap> = {
  modelType: T;
  inputMode: InputMode;
  from: From;
  relatedAll?: boolean;
};

type NewDataStartFormArgs<T extends ModelType> = GetStepsArgs<T> & {
  formMode: FormMode.CREATE;
  initialData?: {
    formData?: FormTypeMap[T];
    metaData?: Record<string, any>;
  };
};

type UpdateDataStartFormArgs<T extends ModelType> = Omit<
  GetStepsArgs<T>,
  "inputMode"
> & {
  inputMode: InputMode.SINGLE;
  formMode: FormMode.UPDATE;
  id: string;
  editItem: GettedModelDataMap[T];
};

type UpdateDatasStartFormArgs<T extends ModelType> = Omit<
  GetStepsArgs<T>,
  "inputMode"
> & {
  inputMode: InputMode.MANY;
  formMode: FormMode.UPDATE;
  ids: string[];
  editItem: GettedModelDataMap[T][];
};

type UpdateStartFormArgs<T extends ModelType> =
  | UpdateDataStartFormArgs<T>
  | UpdateDatasStartFormArgs<T>;

export type StartFormArgs<T extends ModelType> =
  | NewDataStartFormArgs<T>
  | UpdateStartFormArgs<T>;
