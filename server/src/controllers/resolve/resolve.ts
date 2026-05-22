import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  resolveMatch,
  resolvePlayerAppearance,
  resolvePlayerMatchEventLog,
  resolveRefereeAppearance,
  resolveStaffAppearance,
  resolveStaffMatchEventLog,
  resolveTeamMatchFormation,
} from "./models/index.js";
import BadRequestError from "../../errors/bad-request.js";
import { CreateItemResponse } from "@dai0413/myorg-shared";

const resolverMap = {
  match: resolveMatch,
  playerAppearance: resolvePlayerAppearance,
  playerMatchEventLog: resolvePlayerMatchEventLog,
  refereeAppearance: resolveRefereeAppearance,
  staffAppearance: resolveStaffAppearance,
  staffMatchEventLog: resolveStaffMatchEventLog,
  teamMatchFormation: resolveTeamMatchFormation,
};

const resolveModelData = async (
  req: Request,
  res: Response<CreateItemResponse<any>>,
) => {
  if (!req.body) {
    throw new BadRequestError("正しくデータを送信してください");
  }

  const entries = Object.entries(req.body);

  const resolvedEntries = await Promise.all(
    entries.map(async ([key, value]) => {
      const resolver = resolverMap[key as keyof typeof resolverMap];

      if (!resolver) return [key, value];

      const resolvedValue = await resolver(value as any[]);
      return [key, resolvedValue];
    }),
  );

  const data = Object.fromEntries(resolvedEntries);

  res
    .status(StatusCodes.OK)
    .json({ success: true, data, message: "成功しました" });
};

export { resolveModelData };
