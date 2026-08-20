import { Types } from "mongoose";
import { MatchModel } from "../../../../models/match.js";
import { PlayerAppearanceModel } from "../../../../models/player-appearance.js";
import { PlayerRegistrationModel } from "../../../../models/player-registration.js";

type Params = {
  teamObjectId: Types.ObjectId | undefined;
  filterCondition: Record<string, any>;
  playerObjectIds: Types.ObjectId[];
};

const getPlayerMatchIds = async ({
  playerIds,
  season,
  teamId,
}: {
  playerIds: Types.ObjectId[];
  season?: string;
  teamId?: Types.ObjectId;
}): Promise<Types.ObjectId[]> => {
  const registrationMatchIds = (await PlayerRegistrationModel.distinct(
    "match",
    {
      player: { $in: playerIds },
      ...(season && {
        season: new Types.ObjectId(season),
      }),
      ...(teamId && {
        team: teamId,
      }),
    },
  )) as Types.ObjectId[];

  const appearanceMatchIds = (await PlayerAppearanceModel.distinct("match", {
    player: { $in: playerIds },
    ...(teamId && {
      team: teamId,
    }),
  })) as Types.ObjectId[];

  const matchIdMap = new Map<string, Types.ObjectId>();

  for (const id of registrationMatchIds) {
    matchIdMap.set(id.toString(), id);
  }

  for (const id of appearanceMatchIds) {
    matchIdMap.set(id.toString(), id);
  }

  return [...matchIdMap.values()];
};

export const resolvePlayerMatches = async ({
  teamObjectId,
  filterCondition,
  playerObjectIds,
}: Params) => {
  const playerMatchIds = await getPlayerMatchIds({
    playerIds: playerObjectIds,
    teamId: teamObjectId,
  });

  const matches = await MatchModel.find({
    ...filterCondition,
    _id: { $in: playerMatchIds },
  })
    .select("_id season competition")
    .lean();

  const matchIds = matches.map((match) => match._id);

  const matchGroupMap = new Map(
    matches.map((match) => [
      match._id.toString(),
      {
        season: match.season,
        competition: match.competition,
      },
    ]),
  );

  const matchSeasonIds = [
    ...new Map(
      matches
        .map((match) => match.season)
        .filter((season): season is Types.ObjectId => !!season)
        .map((season) => [season.toString(), season]),
    ).values(),
  ];

  return { matchIds, matchGroupMap, matchSeasonIds };
};
