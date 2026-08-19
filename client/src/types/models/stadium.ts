import {
  StadiumFormSchema,
  StadiumPopulatedSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import { Country } from "./country";
import z from "zod";

export type Stadium = Omit<
  z.infer<typeof StadiumPopulatedSchema>,
  "country"
> & {
  country: Country;
};

export type StadiumForm = Partial<
  Omit<z.infer<typeof StadiumFormSchema>, "country"> & {
    country: Country["_id"];
  }
>;

export type StadiumGet = Omit<Stadium, "country"> & {
  country: Label;
};
