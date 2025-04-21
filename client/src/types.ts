export type APIError = {
  error?: {
    code?: number;
    message?: string;
    errors?: Record<string, string[]>;
  };
};

export type TableHeader = {
  label: string;
  field: string;
};

export type Player = {
  _id: string;
  name: string;
  en_name: string;
  dob: string;
  pob: string;
};

export type Transfer = {
  _id: string;
  dob: string;
  from_team: string;
  to_team: string;
  player: string;
  position: string;
  form: string;
  number: string;
  from_date: string;
  to_date: string;
  URL: string;
};

export type Injury = {
  _id: string;
  doa: string;
  team: string;
  now_team: string;
  player: string;
  doi: string;
  dos: string;
  injured_part: string;
  is_injured: string;
  ttp: string;
  erd: string;
  URL: string;
};
