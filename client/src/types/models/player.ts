export type Player = {
  _id: string;
  name?: string;
  en_name?: string;
  dob?: Date;
  pob?: string;
  old_id?: string;
  normalized_en_name?: string;
};

type PlayerPost = Omit<Player, "_id" | "dob"> & {
  dob: string;
};

export type PlayerForm = Partial<PlayerPost>;

export type PlayerGet = Player;
