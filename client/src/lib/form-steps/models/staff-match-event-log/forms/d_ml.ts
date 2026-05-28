import { AxiosInstance } from "axios";
import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/staffMatchEventLog";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/staff-match-event-log";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../../../types/types";
import { createItemBase, readItemsBase } from "../../../../api";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { getFields } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { Team } from "../../../../../types/models/team";
import { MatchFormatGet } from "../../../../../types/models/match-format";
import { calcPeriodLabel } from "../../../utils/onChange/calcPeriodLabel";

const KEYS = ["match", "staff", "team", "match_event_type"] as const;

const resolveStaffMatchEventLog = async (
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

const buildValueLabel = (data: ResolveOutput[]) => ({
  value: resolveToValue(data, KEYS),
  label: resolveToLabel(data, KEYS),
});

export const staffMatchEventLog: FormStep<ModelType.STAFF_MATCH_EVENT_LOG>[] = [
  {
    modelType: ModelType.STAFF_MATCH_EVENT_LOG,
    stepLabel: "スタッフのイベントログを入力開始",
    type: StepType.FORM,
    fields: [],
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData }) => {
      if (!api) return { value: [], label: [] };

      const results = await Promise.all(
        Object.entries(postedDraftData).map(async ([url, posted]) => {
          const draft = draftData[url];

          if (!draft || !draft.staffMatchEventLog)
            return { value: [], label: [] };

          const { _id: matchId, home_team, away_team } = posted.match;

          const match = {
            id: matchId,
            label: posted.matchLabel || "",
          };

          const periods = posted.periods;

          const homeStaffMatchEventLogs: Scraped[] =
            draft.staffMatchEventLog.home;
          const awayStaffMatchEventLogs: Scraped[] =
            draft.staffMatchEventLog.away;

          const pushBySide = (side: "home" | "away", data: Scraped) => {
            if (side === "home") {
              homeStaffMatchEventLogs.push(data);
            } else {
              awayStaffMatchEventLogs.push(data);
            }
          };
          const teamCache: Record<string, "home" | "away"> = {};

          for (const data of draft.staffMatchEventLog.unknown) {
            const key =
              data.team?.abbr ||
              (typeof data.team?.team === "string"
                ? data.team.team
                : undefined);

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

          const home = await resolveStaffMatchEventLog(
            api,
            homeStaffMatchEventLogs,
            match,
            home_team,
            periods,
          );
          const away = await resolveStaffMatchEventLog(
            api,
            awayStaffMatchEventLogs,
            match,
            away_team,
            periods,
          );

          const homeResult = buildValueLabel(home);
          const awayResult = buildValueLabel(away);

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
    },
    many: true,
  },
  {
    modelType: ModelType.STAFF_MATCH_EVENT_LOG,
    stepLabel: "詳細を入力",
    type: StepType.FORM,
    fields: getFields([
      "match",
      "team",
      "match_event_type",
      "staff",
      "staff_name",
      "time",
      "add_time",
      "special_time",
    ]),
    many: true,
  },
  createConfirmationStep<ModelType.STAFF_MATCH_EVENT_LOG>(
    ModelType.STAFF_MATCH_EVENT_LOG,
  ),
];
