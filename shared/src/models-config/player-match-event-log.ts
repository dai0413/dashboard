import z from "zod";
import {
  PlayerMatchEventLogZodSchema,
  PlayerMatchEventLogType,
  PlayerMatchEventLogFormSchema,
  PlayerMatchEventLogResponseSchema,
  PlayerMatchEventLogPopulatedSchema,
} from "../schemas/player-match-event-log.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function playerMatchEventLog<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  PlayerMatchEventLogType,
  z.infer<typeof PlayerMatchEventLogFormSchema>,
  z.infer<typeof PlayerMatchEventLogResponseSchema>,
  z.infer<typeof PlayerMatchEventLogPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "player-match-event-log",
    SCHEMA: {
      DATA: PlayerMatchEventLogZodSchema,
      FORM: PlayerMatchEventLogFormSchema,
      RESPONSE: PlayerMatchEventLogResponseSchema,
      POPULATED: PlayerMatchEventLogPopulatedSchema,
    },
    TYPE: {} as PlayerMatchEventLogType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "match", collection: "matchs" },
      { path: "team", collection: "teams" },
      { path: "player", collection: "players" },
      { path: "matchEventType", collection: "matcheventtypes" },
    ],
    getAllConfig: {
      query: [
        { field: "match", type: "ObjectId" },
        { field: "team", type: "ObjectId" },
        { field: "player", type: "ObjectId" },
        { field: "matchEventType", type: "ObjectId" },
      ],
      sort: { match: -1, time: -1, add_time: -1, order: -1, _id: -1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: true,
    TEST: {
      sampleData: (deps) => [
        {
          match: deps.match._id,
          team: deps.team._id,
          matchEventType: deps.matchEventType._id,
          player: deps.player._id,
          time: 10,
        },
      ],
      updatedData: {
        time: 5,
      },
    },
  };
}
