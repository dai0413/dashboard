import {
  PlayerMatchEventLogZodSchema,
  PlayerMatchEventLogFormSchema,
  PlayerMatchEventLogResponseSchema,
  PlayerMatchEventLogPopulatedSchema,
} from "../schemas/player-match-event-log.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { playerMatchEventLog as convertFun } from "../utils/format/player-match-event-log.js";
import { ParsedQs } from "qs";

export function playerMatchEventLog<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof PlayerMatchEventLogZodSchema,
  typeof PlayerMatchEventLogFormSchema,
  typeof PlayerMatchEventLogResponseSchema,
  typeof PlayerMatchEventLogPopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "player-match-event-log",
    collection_name: "playermatcheventlogs",
    SCHEMA: {
      DATA: PlayerMatchEventLogZodSchema,
      FORM: PlayerMatchEventLogFormSchema,
      RESPONSE: PlayerMatchEventLogResponseSchema,
      POPULATED: PlayerMatchEventLogPopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "match", collection: "matches" },
      { path: "team", collection: "teams" },
      { path: "player", collection: "players" },
      { path: "match_event_type", collection: "matcheventtypes" },
    ],
    getAllConfig: {
      query: [
        { field: "match", type: "ObjectId" },
        { field: "team", type: "ObjectId" },
        { field: "player", type: "ObjectId" },
        { field: "match_event_type", type: "ObjectId" },
      ],
      sort: { match: -1, time: -1, add_time: -1, order: -1, _id: -1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          match: deps.match[0]._id,
          team: deps.team[0]._id,
          match_event_type: deps.matchEventType[0]._id,
          player: deps.player[0]._id,
          time: 10,
        },
      ],
      updatedData: {
        time: 5,
      },
    },
    convertFun: convertFun,
  };
}
