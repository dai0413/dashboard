import z from "zod";
import { InjuryModel, IInjury } from "../../server/models/injury.ts";
import {
  InjuryZodSchema,
  InjuryType,
  InjuryFormSchema,
  InjuryResponseSchema,
} from "../schemas/injury.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";

export const injury: ControllerConfig<
  IInjury,
  InjuryType,
  z.infer<typeof InjuryFormSchema>,
  z.infer<typeof InjuryResponseSchema>
> = {
  name: "injury",
  SCHEMA: {
    DATA: InjuryZodSchema,
    FORM: InjuryFormSchema,
    RESPONSE: InjuryResponseSchema,
  },
  TYPE: {} as InjuryType,
  MONGO_MODEL: InjuryModel,
  POPULATE_PATHS: [],
  getALL: {
    sort: { _id: 1 },
  },
  bulk: false,
  download: false,
  TEST: {
    sampleData: [
      {
        doa: new Date("2030/07/22"),
        team: "681976898eb4e937aacd0bed",
        player: "68197b2d825ad6c2dddd0903",
        doi: new Date("2025/07/12"),
        injured_part: ["膝"],
        ttp: ["1d"],
        is_injured: true,
      },
    ],
    updatedData: {
      is_injured: false,
    },
  },
};
