import {
  Form,
  Scraped,
} from "@dai0413/myorg-shared/types/j_m/referee-appearance";
import { resolve } from "./resolve.js";
import { ResolveField } from "../types.js";
import { RefereeModel } from "../../../../models/referee.js";

const resolveFields: ResolveField<Scraped>[] = [
  {
    key: "referee",
    model: RefereeModel,
  },
];

const removeFields: string[] = [];

export const resolveRefereeAppearance = async (data: Scraped[]) => {
  const resolved = await resolve<Scraped, Form>(
    data,
    resolveFields,
    removeFields,
  );
  return resolved;
};
