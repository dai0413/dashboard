import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getValues as get } from "@dai0413/scraping-logic/J";
import {
  Form,
  Scraped,
} from "@dai0413/myorg-shared/types/j_m/player-appearance";
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

const getPlayerAppearance = async (req: Request, res: Response) => {
  try {
    const { url, season, match, data } = req.body;
    if (!url) throw new BadRequestError("urlを送信してください");
    if (
      !season ||
      typeof season !== "string" ||
      !mongoose.Types.ObjectId.isValid(season)
    ) {
      throw new BadRequestError("seasonを送信してください");
    }

    let playerAppearance: { home: Scraped; away: Scraped } | undefined =
      undefined;
    let resolvedMatch: any = undefined;

    if (!data || !resolvedMatch) {
      const result = await get(url);

      if (result.ok) {
        const { match, playerAppearance } = result.data;

        const resolvedMatch = await resolveMatch(match);
        playerAppearance = result.data;

        const { home_team, away_team, date } = resolvedMatch;
        const targetSeasons = await getTargetSeasons(
          season,
          home_team?.id,
          away_team?.id,
          date,
        );
      }
    }

    const resolvedPlayerAppearance = await resolvePlayerAppearance(
      data,
      targetSeasons,
      { home: home_team?.id, away: away_team?.id },
    );

    const resolved = resolvedPlayerAppearance;

    res.status(StatusCodes.OK).json({ data: resolved });
  } catch (error) {
    console.error("Error in getPlayerAppearance:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch match");
  }
};

export { getPlayerAppearance };
