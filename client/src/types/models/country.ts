import {
  CountryFormSchema,
  CountryPopulatedSchema,
} from "@dai0413/myorg-shared";
import z from "zod";

export type Country = z.infer<typeof CountryPopulatedSchema>;

export type CountryForm = Partial<z.infer<typeof CountryFormSchema>>;

export type CountryGet = Country;
