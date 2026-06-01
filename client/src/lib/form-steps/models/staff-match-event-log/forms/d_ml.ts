import { AxiosInstance } from "axios";
import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/staffMatchEventLog";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/staff-match-event-log";
import {
  DraftData,
  FormStep,
  PostedDraftData,
  StepType,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../../../types/types";
import { createItemBase, readItemBase, readItemsBase } from "../../../../api";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { Team } from "../../../../../types/models/team";
import { MatchFormatGet } from "../../../../../types/models/match-format";
import { calcPeriodLabel } from "../../../utils/onChange/calcPeriodLabel";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { Match } from "../../../../../types/models/match";
import { convert } from "../../../../convert/DBtoGetted";
import { convert as createLabel } from "../../../../convert/CreateLabel";

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

type BaseModel = ModelType.STAFF_MATCH_EVENT_LOG;
const baseModel = ModelType.STAFF_MATCH_EVENT_LOG;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "id");

export const multiModel: FormStep<BaseModel>[] = [
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];

export const staffMatchEventLog: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "スタッフのイベントログを入力開始",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      if (!api) return { value: [], label: [] };

      const ids: string[] = metaData?.match;

      const readDraftData = async (
        matchId: string,
      ): Promise<DraftData[any]> => {
        const readMatch = async () =>
          createItemBase<DraftData[any]["match"]>({
            apiInstance: api,
            backendRoute: API_PATHS.GET_NEW_DATA.D_M.MATCH,
            data: { id: matchId },
          });

        const readStaffMatchEventLog = async () =>
          createItemBase<DraftData[any]["staffMatchEventLog"]>({
            apiInstance: api,
            backendRoute: API_PATHS.GET_NEW_DATA.D_M.STAFF_MATCH_EVENT_LOG,
            data: { id: matchId },
          });

        const [resMatch, resStaffMatchEventLog] = await Promise.all([
          readMatch(),
          readStaffMatchEventLog(),
        ]);

        if (!resMatch.success || !resStaffMatchEventLog.success) return {};

        const results: DraftData[any] = {
          match: resMatch.data,
          staffMatchEventLog: resStaffMatchEventLog.data,
        };

        return results;
      };

      const readPostedDraftData = async (
        matchId: string,
      ): Promise<PostedDraftData[any]> => {
        const readMatch = async () =>
          readItemBase<Match>({
            apiInstance: api,
            backendRoute: API_PATHS.MATCH.DETAIL(matchId),
          });

        const resMatch = await readMatch();

        if (!resMatch) return {};

        const match = convert(ModelType.MATCH, resMatch);

        if (!match) return {};
        let results: PostedDraftData[any] = {
          match: convert(ModelType.MATCH, resMatch),
          matchLabel: createLabel(ModelType.MATCH, resMatch),
        };

        return results;
      };

      const results = await Promise.all(
        ids.map(async (id) => {
          const newDraftData =
            id in draftData && draftData[id].staffMatchEventLog
              ? draftData[id]
              : await readDraftData(id);

          if (!newDraftData.staffMatchEventLog) return { value: [], label: [] };

          const {
            home: homeStaffMatchEventLogs,
            away: awayStaffMatchEventLogs,
            unknown: unknownStaffMatchEventLogs,
          } = newDraftData.staffMatchEventLog;

          const posted =
            id in postedDraftData && postedDraftData[id].match
              ? postedDraftData[id]
              : await readPostedDraftData(id);

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
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
