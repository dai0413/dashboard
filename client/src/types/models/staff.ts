import { StaffPopulatedSchema, StaffFormSchema } from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Player } from "./player";

export type Staff = Omit<z.infer<typeof StaffPopulatedSchema>, "player"> & {
  player?: Player;
};

export type StaffForm = Partial<
  Omit<z.infer<typeof StaffFormSchema>, "player" | "dob"> & {
    player?: Player["_id"];
    dob?: string;
  }
>;

export type StaffGet = Omit<Staff, "player"> & {
  player?: Label;
};
