import { PlayerResponseSchema, position } from "@dai0413/myorg-shared";
import z from "zod";

type PlayerGet = z.infer<typeof PlayerResponseSchema>;
const positionOptions = position().map((item) => item.key);
type Position = (typeof positionOptions)[number];

export type PlayerStatistic = {
  player: PlayerGet;
  mainPosition?: Position;
  positionCounts: Partial<Record<Position, number>>;
  appearances: number;
  starts: number;
  subs: number;
  bench: number;
  minutes: number;
  goals: number;
  assists: number;
};
