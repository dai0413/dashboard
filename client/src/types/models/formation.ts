import {
  FormationPopulatedSchema,
  FormationFormSchema,
} from "@dai0413/myorg-shared";
import z from "zod";

export type Formation = z.infer<typeof FormationPopulatedSchema>;

export type FormationForm = Partial<z.infer<typeof FormationFormSchema>>;

export type FormationGet = Formation;
