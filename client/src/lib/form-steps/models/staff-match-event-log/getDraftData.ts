import { AxiosInstance } from "axios";
import { API_PATHS, Label, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/staffMatchEventLog";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/staff-match-event-log";
import { GetDraftData } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { Team } from "../../../../types/models/team";
import { createItemBase, readItemsBase } from "../../../api";
import { readDraftData } from "../../utils/getDraftData/readDraftData";
import { readPostedDraftData } from "../../utils/getDraftData/readPostedDraftData";
import { MatchFormatGet } from "../../../../types/models/match-format";
import { calcPeriodLabel } from "../../utils/onChange/calcPeriodLabel";
import { buildValueLabel } from "../../utils/resolver/resolveToValue";

const KEYS = ["match", "staff", "team", "match_event_type"] as const;

const resolve = async (
  api: AxiosInstance,
  data: Scraped[],
  match: Label,
  team?: Label,
  periods?: MatchFormatGet["period"],
) => {
  const buildResolveInput = (
    draftData: Scraped[],
    match: Label,
    team?: Label,
    periods?: MatchFormatGet["period"],
  ): ResolveInput<{
    staff: Select.MODEL;
    match_event_type: Select.MODEL;
  }>[] => {
    const data = draftData.map((d) => {
      return {
        ...d,
        match,
        team,
        period_label: calcPeriodLabel(d, periods),
      };
    });

    return data;
  };

  const fetchResolved = async (
    api: AxiosInstance,
    input: ResolveInput<{
      staff: Select.MODEL;
      match_event_type: Select.MODEL;
    }>[],
  ): Promise<ResolveOutput[]> => {
    const res = await createItemBase<{ staffMatchEventLog: ResolveOutput[] }>({
      apiInstance: api,
      backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
      data: { staffMatchEventLog: input },
      returnResponse: true,
    });

    if (!res.success) return [];

    return res.data.staffMatchEventLog;
  };

  const input = buildResolveInput(data, match, team, periods);
  return fetchResolved(api, input);
};

export const getDraftData: GetDraftData<
  ModelType.STAFF_MATCH_EVENT_LOG,
  true
> = async ({ api, draftData, postedDraftData, metaData }) => {
  if (!api) return { value: [], label: [] };

  const ids: string[] = metaData?.match;

  const updatedDraftData = await readDraftData({
    api,
    draftData,
    matchIds: ids,
    keys: ["match", "staffMatchEventLog"],
  });

  const updatedPostedDraftData = await readPostedDraftData({
    api,
    postedDraftData,
    matchIds: ids,
    keys: ["match"],
  });

  const results = await Promise.all(
    ids.map(async (id) => {
      const newDraftData = updatedDraftData[id];

      if (!newDraftData.staffMatchEventLog) return { value: [], label: [] };

      const {
        home: homeStaffMatchEventLogs,
        away: awayStaffMatchEventLogs,
        unknown: unknownStaffMatchEventLogs,
      } = newDraftData.staffMatchEventLog;

      const posted = updatedPostedDraftData[id];

      if (!posted.match) return { value: [], label: [] };

      const { _id: matchId, home_team, away_team } = posted.match;

      const match = {
        id: matchId,
        label: posted.matchLabel || "",
      };

      const periods = posted.periods;

      const pushBySide = (side: "home" | "away", data: Scraped) => {
        if (side === "home") {
          homeStaffMatchEventLogs.push(data);
        } else {
          awayStaffMatchEventLogs.push(data);
        }
      };
      const teamCache: Record<string, "home" | "away"> = {};

      for (const data of unknownStaffMatchEventLogs) {
        const key =
          data.team?.abbr ||
          (typeof data.team?.team === "string" ? data.team.team : undefined);

        if (!key) continue;

        if (teamCache[key]) {
          pushBySide(teamCache[key], data);
          continue;
        }

        type TeamParams = Partial<Pick<Team, "team" | "abbr">>;
        const params: TeamParams = {};

        if (data.team?.team) params.team = data.team.team;
        if (data.team?.abbr) params.abbr = data.team?.abbr;

        const res = await readItemsBase<Team[]>({
          apiInstance: api,
          backendRoute: API_PATHS.TEAM.ROOT,
          params: params,
        });

        const teamObj = res?.data[0];

        if (!teamObj || res.data.length > 1) continue;

        const teamId = teamObj._id;

        let side: "home" | "away" | undefined;

        if (teamId === home_team.id) {
          side = "home";
        } else if (teamId === away_team.id) {
          side = "away";
        }

        if (!side) continue;

        teamCache[key] = side;
        pushBySide(side, data);
      }

      const home = await resolve(
        api,
        homeStaffMatchEventLogs,
        match,
        home_team,
        periods,
      );
      const away = await resolve(
        api,
        awayStaffMatchEventLogs,
        match,
        away_team,
        periods,
      );

      const homeResult = buildValueLabel(home, KEYS);
      const awayResult = buildValueLabel(away, KEYS);

      return {
        value: [...homeResult.value, ...awayResult.value],
        label: [...homeResult.label, ...awayResult.label],
      };
    }),
  );

  return {
    value: results.flatMap((r) => r.value),
    label: results.flatMap((r) => r.label),
  };
};
