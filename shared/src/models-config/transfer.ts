import { PipelineStage, Types } from "mongoose";
import {
  TransferZodSchema,
  TransferFormSchema,
  TransferResponseSchema,
  TransferPopulatedSchema,
} from "../schemas/transfer.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { transfer as convertFun } from "../utils/format/transfer.js";
import { ParsedQs } from "qs";

export function transfer<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof TransferZodSchema,
  typeof TransferFormSchema,
  typeof TransferResponseSchema,
  typeof TransferPopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "transfer",
    collection_name: "transfers",
    SCHEMA: {
      DATA: TransferZodSchema,
      FORM: TransferFormSchema,
      RESPONSE: TransferResponseSchema,
      POPULATED: TransferPopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "from_team", collection: "teams" },
      { path: "to_team", collection: "teams" },
      { path: "player", collection: "players" },
    ],
    getAllConfig: {
      query: [
        { field: "player", type: "ObjectId" },
        { field: "from_team", type: "ObjectId" },
        { field: "to_team", type: "ObjectId" },
        { field: "from_date", type: "Date" },
        { field: "to_date", type: "Date" },
        { field: "from_team.age_group", type: "String", populateAfter: true },
        { field: "form", type: "String" },
        { field: "isCancelled", type: "Boolean" },
      ],
      buildCustomMatch: customMatchFn,
      buildCustomPipeline: ({ req, beforeMatch, afterMatch }) => {
        const conditionMap = new Map<string, any>();

        for (const condition of beforeMatch.$and ?? []) {
          const key = Object.keys(condition)[0];
          conditionMap.set(key, condition[key]);
        }

        const fromDate = conditionMap.get("from_date");

        const seasonStart = fromDate?.$gte;
        const seasonEnd = fromDate?.$lte;
        const toTeam = conditionMap.get("to_team");

        if (!seasonStart || !seasonEnd || !toTeam) {
          return {
            beforeMatch,
            afterMatch,
          };
        }

        const seasonStartConditions = [];

        for (const [key, value] of conditionMap) {
          switch (key) {
            case "from_date":
              seasonStartConditions.push({
                from_date: {
                  $lte: seasonEnd,
                },
              });
              break;

            case "to_team":
              // 最後に判定するので除外
              break;

            default:
              seasonStartConditions.push({
                [key]: value,
              });
          }
        }

        beforeMatch = {
          $and: seasonStartConditions,
        };

        const seasonStartPipeline: PipelineStage[] = [
          {
            $sort: {
              player: 1,
              from_date: -1,
            },
          },
          {
            $group: {
              _id: "$player",
              doc: {
                $first: "$$ROOT",
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: "$doc",
            },
          },
          {
            $match: {
              to_team: conditionMap.get("to_team"),
            },
          },
        ];

        const joinedConditions = [];

        for (const [key, value] of conditionMap) {
          switch (key) {
            case "from_date":
              joinedConditions.push({
                from_date: {
                  $gte: seasonStart,
                  $lte: seasonEnd,
                },
              });
              break;

            default:
              joinedConditions.push({
                [key]: value,
              });
          }
        }

        const joinedDuringSeasonPipeline: PipelineStage[] = [
          {
            $match: {
              $and: joinedConditions,
            },
          },
          {
            $sort: {
              player: 1,
              from_date: -1,
            },
          },
          {
            $group: {
              _id: "$player",
              doc: {
                $first: "$$ROOT",
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: "$doc",
            },
          },
        ];

        const pipeline = [
          ...seasonStartPipeline,
          {
            $unionWith: {
              coll: "transfers",
              pipeline: joinedDuringSeasonPipeline,
            },
          },
          {
            $sort: {
              player: 1,
              from_date: -1,
            },
          },
          {
            $group: {
              _id: "$player",
              doc: {
                $first: "$$ROOT",
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: "$doc",
            },
          },
        ] as PipelineStage[];

        return {
          beforeMatch,
          afterMatch,
          pipeline,
        };
      },
      sort: { doa: -1, _id: -1 },
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          doa: new Date("2030/07/22"),
          from_team_name: "original team",
          player: deps.player[0]._id,
          position: ["GK"],
          form: "完全",
          from_date: new Date("2025/07/12"),
        },
        {
          doa: new Date("2030/07/28"),
          to_team: deps.team[0]._id,
          player: deps.player[0]._id,
          position: ["GK"],
          form: "完全",
          from_date: new Date("2025/07/12"),
        },
        {
          doa: new Date("2030/08/01"),
          from_team: deps.team[0]._id,
          player: deps.player[0]._id,
          position: ["GK"],
          form: "完全",
          from_date: new Date("2025/07/12"),
        },
      ],
      updatedData: {
        form: "期限付き",
      },
    },
    convertFun: convertFun,
  };
}
