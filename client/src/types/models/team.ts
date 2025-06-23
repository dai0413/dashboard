export type Team = {
  _id: string;
  team: string;
  abbr: string;
  pro: string;
};

type TeamPost = Omit<Team, "_id">;

export type TeamForm = Partial<TeamPost>;

export type TeamGet = Team;
