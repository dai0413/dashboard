import { Request, Response } from "express";
import BadRequestError from "src/errors/bad-request.js";
import { StatusCodes } from "http-status-codes";
import {
  resolveMatch,
  resolvePlayerAppearance,
  resolvePlayerMatchEventLog,
  resolveRefereeAppearance,
  resolveStaffAppearance,
} from "./models/index.js";

const resolverMap = {
  match: resolveMatch,
  playerAppearance: resolvePlayerAppearance,
  playerMatchEventLog: resolvePlayerMatchEventLog,
  refereeAppearance: resolveRefereeAppearance,
  staffAppearance: resolveStaffAppearance,
};

const resolveModelData = async (req: Request, res: Response) => {
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

  res.status(StatusCodes.OK).json({ data });
};

export { resolveModelData };
