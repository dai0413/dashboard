import {
  PlayerResponseSchema,
  position,
  TeamPopulatedSchema,
  CountryPopulatedSchema,
  SeasonPopulatedSchema,
  CompetitionPopulatedSchema,
} from "@dai0413/myorg-shared";
import z from "zod";

type Player = z.infer<typeof PlayerResponseSchema>;
const positionOptions = position().map((item) => item.key);
type Position = (typeof positionOptions)[number];

type Country = z.infer<typeof CountryPopulatedSchema>;
type Team = Omit<z.infer<typeof TeamPopulatedSchema>, "country"> & {
  country: Country;
};
type Competition = z.infer<typeof CompetitionPopulatedSchema>;
type Season = Omit<z.infer<typeof SeasonPopulatedSchema>, "competition"> & {
  competition: Competition;
};

export enum PlayerStatisticsGroupBy {
  SEASON = "season",
  COMPETITION = "competition",
  TEAM = "team",
}

type StatisticsGroup<TSeason, TCompetition, TTeam> =
  | {
      by: PlayerStatisticsGroupBy.SEASON;
      id: string;
      data: TSeason;
    }
  | {
      by: PlayerStatisticsGroupBy.COMPETITION;
      id: string;
      data: TCompetition;
    }
  | {
      by: PlayerStatisticsGroupBy.TEAM;
      id: string;
      data: TTeam;
    };

type StatisticsGroupRaw = StatisticsGroup<Season, Competition, Team>;

export type PlayerStatistic = {
  player: Player;
  mainPosition?: Position;
  positionCounts: Partial<Record<Position, number>>;
  appearances: number;
  starts: number;
  subs: number;
  bench: number;
  minutes: number;
  goals: number;
  assists: number;

  teams?: Team[];
  group?: StatisticsGroupRaw;
};
