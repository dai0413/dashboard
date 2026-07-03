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
      ],
      buildCustomMatch: customMatchFn,
      buildCustomPipeline: ({ req, beforeMatch }) => {
        if (!req.query.as_of || !req.query.to_team) {
          return {};
        }

        const conditions = beforeMatch.$and ?? [];

        const newConditions = [];
        let afterMatch = {};

        const asOf = new Date(req.query.as_of as string);

        for (const condition of conditions) {
          if ("to_team" in condition) {
            afterMatch = condition;
            continue;
          }

          if ("from_date" in condition) {
            newConditions.push({
              from_date: {
                $lt: asOf,
              },
            });
            continue;
          }

          newConditions.push(condition);
        }

        const newBeforeMatch = {
          $and: newConditions,
        };

        const pipeline: PipelineStage[] = [
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
              to_team: new Types.ObjectId(req.query.to_team),
            },
          },
        ];

        return {
          beforeMatch: newBeforeMatch,

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
