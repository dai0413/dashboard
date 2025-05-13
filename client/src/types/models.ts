export const PositionOptions = [
  "GK",
  "DF",
  "CB",
  "RCB",
  "LCB",
  "SB",
  "RSB",
  "LSB",
  "WB",
  "RWB",
  "LWB",
  "MF",
  "CM",
  "DM",
  "OM",
  "WG",
  "RWG",
  "LWG",
  "CF",
  "FW",
];

type Position = (typeof PositionOptions)[number] | null;

export const FormOptions = [
  "完全",
  "期限付き",
  "期限付き満了",
  "期限付き解除",
  "育成型期限付き",
  "育成型期限付き満了",
  "育成型期限付き解除",
  "満了",
  "退団",
  "引退",
  "延長",
  "契約解除",
  "復帰",
  "離脱",
  "更新",
];

type Form = (typeof FormOptions)[number] | null;

export type Player = {
  _id: string;
  name: string | null;
  en_name: string | null;
  dob: Date | null;
  pob: string | null;
};

export type Transfer = {
  _id: string;
  doa: Date;
  from_team: Team | null;
  to_team: Team | null;
  player: Player;
  position: Position | null;
  form: Form | null;
  number: number | null;
  from_date: Date;
  to_date: Date | null;
  URL: string[] | null;
};

export type TransferPost = Omit<
  Transfer,
  "_id" | "player" | "from_team" | "to_team"
> & {
  player: Player["_id"];
  from_team: Team["_id"] | null;
  to_team: Team["_id"] | null;
};

export type TransferForm = Partial<TransferPost>;

export type TransferGet = Omit<
  TransferPost,
  "doa" | "from_date" | "to_date"
> & {
  doa: string;
  from_date: string;
  to_date: string | null;
  player: Player;
  from_team: Team;
  to_team: Team;
};

export type TransferPatch = Partial<TransferPost>;

export type Injury = {
  _id: string;
  doa: Date;
  team: Team | null;
  now_team: Team | null;
  player: Player;
  doi: Date | null;
  dos: Date | null;
  injured_part: string[];
  is_injured: boolean | null;
  ttp: string;
  erd: Date | null;
  URL: string[] | null;
};

export type Team = {
  _id: string;
  team: string;
  abbr: string;
  pro: string;
};
