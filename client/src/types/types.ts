import { MatchGet } from "./models/match";

export type TableHeader = {
  label: string;
  field: string;
  getData?: (data: any) => string | Label;
  width?: string;
  isPrimary?: boolean;
};

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
