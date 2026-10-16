import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { TopPanelItems, TopPanelRows } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { convert } from "../../../../lib/convert/CreateLabel";
import { ModelType } from "../../../../types/models";
import { Label } from "@dai0413/myorg-shared";
import { createFormationItems } from "./createFormationItems";

type CompetitionRecord = Pick<
  PlayerStatistic,
  "positionCounts" | "appearances"
> & {
  season: Label;
  competition: Label;
  team: Label;
  starts: number;
  subs: number;
  bench: number;
  goals: number;
  assists: number;

  start_date?: Date;
  end_date?: Date;
};

const createCompetitionRecords = (
  statistics: PlayerStatistic[],
): CompetitionRecord[] => {
  const records: CompetitionRecord[] = statistics
    .map((statistic) => {
      if (statistic.teams?.length !== 1 || statistic.group?.by !== "season")
        return;

      const originalCompetition = statistic.group.data.competition;
      const originalTeam = statistic.teams[0];
      const originalSeason = statistic.group.data;

      const season = {
        label: convert(ModelType.SEASON, originalSeason),
      };

      const competition = {
        label: convert(ModelType.COMPETITION, originalCompetition),
        id: originalCompetition._id,
      };

      const team = {
        label: convert(ModelType.TEAM, originalTeam),
        id: originalTeam._id,
      };

      const { starts, subs, bench, goals, assists } = statistic;

      return {
        season,
        competition,
        team,
        starts,
        subs,
        bench,
        goals,
        assists,
        start_date: originalSeason.start_date,
        end_date: originalSeason.end_date
          ? new Date(originalSeason.end_date)
          : undefined,
        positionCounts: statistic.positionCounts,
        appearances: statistic.appearances,
      };
    })
    .filter(
      (r) =>
        r &&
        r.start_date &&
        r.end_date &&
        new Date().getTime() >= new Date(r.start_date).getTime() &&
        new Date().getTime() <= new Date(r.end_date).getTime(),
    )
    .filter((r) => typeof r !== "undefined")
    .sort((a, b) => {
      return (b.end_date?.getTime() ?? 0) - (a.end_date?.getTime() ?? 0);
    });

  return records;
};

const createRows = (items: CompetitionRecord[]) => {
  const rows = items.map((item, i) => {
    const isSeasonBlank =
      i > 0 && items[i - 1].season.label === item.season.label;

    const isTeamBlank =
      isSeasonBlank && i > 0 && items[i - 1].team.label === item.team.label;

    return {
      season: {
        value: {
          label: isSeasonBlank ? "" : item.season.label,
        },
      },
      competition: {
        value: {
          to: `${APP_ROUTES.COMPETITION_SUMMARY}/${item.competition.id}`,
          label: item.competition.label,
        },
      },
      team: {
        value: {
          to: `${APP_ROUTES.TEAM_SUMMARY}/${item.team.id}`,
          label: isTeamBlank ? "" : item.team.label,
        },
      },
      starts: {
        value: {
          label: String(item.starts),
        },
        className: item.starts === 0 ? "text-gray-300" : undefined,
      },
      subs: {
        value: {
          label: String(item.subs),
        },
        className: item.subs === 0 ? "text-gray-300" : undefined,
      },
      bench: {
        value: {
          label: String(item.bench),
        },
        className: item.bench === 0 ? "text-gray-300" : undefined,
      },
      goals: {
        value: {
          label: String(item.goals),
        },
        className: item.goals === 0 ? "text-gray-300" : undefined,
      },
      assists: {
        value: {
          label: String(item.assists),
        },
        className: item.assists === 0 ? "text-gray-300" : undefined,
      },
    };
  });

  return rows;
};

const createFooterRows = (sum: CompetitionRecord): TopPanelRows[] => {
  const footerRows = {
    competition: {
      value: {
        ...sum.competition,
      },
    },
    season: {
      value: {
        ...sum.season,
      },
    },
    team: {
      value: {
        ...sum.team,
      },
    },
    starts: {
      value: {
        label: String(sum.starts),
      },
      className: sum.starts === 0 ? "text-gray-300" : undefined,
    },
    subs: {
      value: {
        label: String(sum.subs),
      },
      className: sum.subs === 0 ? "text-gray-300" : undefined,
    },
    bench: {
      value: {
        label: String(sum.bench),
      },
      className: sum.bench === 0 ? "text-gray-300" : undefined,
    },
    goals: {
      value: {
        label: String(sum.goals),
      },
      className: sum.goals === 0 ? "text-gray-300" : undefined,
    },
    assists: {
      value: {
        label: String(sum.assists),
      },
      className: sum.assists === 0 ? "text-gray-300" : undefined,
    },
  };
  return [footerRows];
};

const createGroupedStatistics = (
  datas: CompetitionRecord[],
): CompetitionRecord => {
  const total: CompetitionRecord = {
    competition: { label: "総計" },
    season: { label: "" },
    team: { label: "" },
    starts: 0,
    subs: 0,
    bench: 0,
    goals: 0,
    assists: 0,
    positionCounts: {},
    appearances: 0,
  };

  for (const data of datas) {
    total.starts += data.starts;
    total.subs += data.subs;
    total.bench += data.bench;
    total.goals += data.goals;
    total.assists += data.assists;
    total.appearances += data.appearances;

    for (const [position, count] of Object.entries(data.positionCounts)) {
      if (count)
        total.positionCounts[position] =
          (total.positionCounts[position] ?? 0) + count;
    }
  }

  return total;
};

export const createTopPanelItems = (
  statistics: PlayerStatistic[],
): TopPanelItems => {
  const competitionRecords = createCompetitionRecords(statistics);

  const positions = createFormationItems(competitionRecords);

  const sum = createGroupedStatistics(competitionRecords);

  return {
    doughnut: { start: sum.starts, sub: sum.subs, bench: sum.bench },
    table: {
      rows: createRows(competitionRecords),
      footerRows: createFooterRows(sum),
    },
    positions,
  };
};
