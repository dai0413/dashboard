import z from "zod";
import {
  FormationZodSchema,
  FormationType,
  FormationFormSchema,
  FormationResponseSchema,
  FormationPopulatedSchema,
} from "../schemas/formation.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function formation<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  FormationType,
  z.infer<typeof FormationFormSchema>,
  z.infer<typeof FormationResponseSchema>,
  z.infer<typeof FormationPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "formation",
    SCHEMA: {
      DATA: FormationZodSchema,
      FORM: FormationFormSchema,
      RESPONSE: FormationResponseSchema,
      POPULATED: FormationPopulatedSchema,
    },
    TYPE: {} as FormationType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [],
    getAllConfig: {
      query: [{ field: "name", type: "String" }],
      sort: {
        name: -1,
        _id: -1,
      },
      buildCustomMatch: customMatchFn,
    },
    bulk: false,
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
