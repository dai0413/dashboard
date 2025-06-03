export type Player = {
  _id: string;
  name: string | null;
  en_name: string | null;
  dob: Date | null;
  pob: string | null;
};

type PlayerPost = Omit<Player, "_id">;

export type PlayerForm = Partial<PlayerPost>;

export type PlayerGet = Player;
