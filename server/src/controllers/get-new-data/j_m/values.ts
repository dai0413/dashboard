import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getMatch as get } from "@dai0413/scraping-logic/J";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";
import { resolveMatch } from "./resolve/resolveMatch.js";
import { resolvePlayerMatchEventLog } from "./resolve/resolvePlayerMatchEventLog.js";
import { resolvePlayerAppearance } from "./resolve/resolvePlayerAppearance.js";
import { resolveRefereeAppearance } from "./resolve/resolveRefereeAppearance.js";
import mongoose from "mongoose";
import { getTargetSeasons } from "./utils/getTargetSeasons.js";
import { result } from "./sample.js";
import { resolveStaffAppearance } from "./resolve/resolveStaffAppearance.js";
import { Form, Scraped } from "@dai0413/myorg-shared/types/j_m/values";

const getValues = async (req: Request, res: Response) => {
  try {
    const { url, season } = req.body;
    if (!url) throw new BadRequestError("urlを送信してください");
    if (
      !season ||
      typeof season !== "string" ||
      !mongoose.Types.ObjectId.isValid(season)
    ) {
      throw new BadRequestError("seasonを送信してください");
    }

    // const result = await get(url);

    if (result.ok) {
      const {
        match,
        playerAppearance,
        playerMatchEventLog,
        refereeAppearance,
        staffAppearance,
      }: Scraped = result.data;

      const resolvedMatch = await resolveMatch(match);
      const { home_team, away_team, date } = resolvedMatch;
      const targetSeasons = await getTargetSeasons(
        season,
        home_team?.id,
        away_team?.id,
        date,
      );

      const resolvedPlayerAppearance = await resolvePlayerAppearance(
        playerAppearance,
        targetSeasons,
        { home: home_team?.id, away: away_team?.id },
      );
      const resolvedPlayerMatchEventLog = await resolvePlayerMatchEventLog(
        playerMatchEventLog,
        resolvedPlayerAppearance,
      );
      const resolvedRefereeAppearance =
        await resolveRefereeAppearance(refereeAppearance);
      const resolvedStaffAppearance = await resolveStaffAppearance(
        staffAppearance,
        targetSeasons,
        { home: home_team?.id, away: away_team?.id },
      );

      const resolved: Form = {
        match: resolvedMatch,
        playerAppearance: resolvedPlayerAppearance,
        playerMatchEventLog: resolvedPlayerMatchEventLog,
        refereeAppearance: resolvedRefereeAppearance,
        staffAppearance: resolvedStaffAppearance,
      };

      res.status(StatusCodes.OK).json({ data: resolved });
    } else {
      throw new InternalServerError(result.error);
    }
  } catch (error) {
    console.error("Error in getValues:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch match");
  }
};

export { getValues };
