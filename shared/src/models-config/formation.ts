import {
  FormationZodSchema,
  FormationFormSchema,
  FormationResponseSchema,
  FormationPopulatedSchema,
} from "../schemas/formation.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function formation<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof FormationZodSchema,
  typeof FormationFormSchema,
  typeof FormationResponseSchema,
  typeof FormationPopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "formation",
    collection_name: "formations",
    SCHEMA: {
      DATA: FormationZodSchema,
      FORM: FormationFormSchema,
      RESPONSE: FormationResponseSchema,
      POPULATED: FormationPopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [],
    getAllConfig: {
      query: [
        { field: "name", type: "String" },
        { field: "key", type: "String" },
      ],
      sort: {
        name: -1,
        _id: -1,
      },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: [
        {
          name: "4-2-3-1",
          position_formation: [
            "GK",
            "RSB",
            "LSB",
            "RCB",
            "LCB",
            "RCM",
            "LCM",
            "OM",
            "RSH",
            "LSH",
            "CF",
          ],
        },
      ],
      updatedData: {
        name: "update_formation",
      },
    },
  };
}
