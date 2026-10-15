import { Label } from "@dai0413/myorg-shared";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { MatchGet } from "../../../../../types/models/match";
import { TopPanelItems } from "../types";

type CompetitionRecord = {
  competition: Label;
  total: number;
  win: number;
  draw: number;
  lose: number;
};

const calcSum = (datas: CompetitionRecord[]): CompetitionRecord => {
  const sum = {
    competition: { label: "総計" },
    total: 0,
    win: 0,
    draw: 0,
    lose: 0,
  };

  for (const data of datas) {
    sum.total += data.total;
    sum.win += data.win;
    sum.draw += data.draw;
    sum.lose += data.lose;
  }

  return sum;
};

const winRate = (win: number, total: number) =>
  total > 0 ? (win / total) * 100 : 0;

const createCompetitionRecords = (
  teamId: string,
  matches: MatchGet[],
): CompetitionRecord[] => {
  const records = new Map<string, CompetitionRecord>();

  for (const match of matches) {
    const isHome = match.home_team.id === teamId;
    const isAway = match.away_team.id === teamId;

    // 対象チームの試合以外は除外
    if (!isHome && !isAway) continue;

    // スコア未確定の試合は除外
    if (match.home_goal == undefined || match.away_goal == undefined) {
      continue;
    }

    const competitionId = match.competition.id || "";

    if (!records.has(competitionId)) {
      records.set(competitionId, {
        competition: match.competition,
        total: 0,
        win: 0,
        draw: 0,
        lose: 0,
      });
    }

    const record = records.get(competitionId)!;

    record.total++;

    const teamGoal = isHome ? match.home_goal : match.away_goal;
    const opponentGoal = isHome ? match.away_goal : match.home_goal;

    if (teamGoal > opponentGoal) {
      record.win++;
    } else if (teamGoal < opponentGoal) {
      record.lose++;
    } else {
      record.draw++;
    }
  }

  return Array.from(records.values());
};

const createRows = (items: CompetitionRecord[]) => {
  const rows = items.map((item) => {
    return {
      competition: {
        value: {
          to: `${APP_ROUTES.COMPETITION_SUMMARY}/${item.competition.id}`,
          label: item.competition.label,
        },
      },
      total: {
        value: {
          label: String(item.total),
        },
        className: item.total === 0 ? "text-gray-300" : undefined,
      },
      win: {
        value: {
          label: String(item.win),
        },
        className: item.win === 0 ? "text-gray-300" : undefined,
      },
      draw: {
        value: {
          label: String(item.draw),
        },
        className: item.draw === 0 ? "text-gray-300" : undefined,
      },
      lose: {
        value: {
          label: String(item.lose),
        },
        className: item.lose === 0 ? "text-gray-300" : undefined,
      },
      winRate: {
        value: {
          label:
            item.total === 0
              ? ""
              : `${String(winRate(item.win, item.total).toFixed(1))}%`,
        },
        className: item.total === 0 ? "text-gray-300" : undefined,
      },
    };
  });

  return rows;
};

const createFooterRows = (sum: CompetitionRecord) => {
  const footerRows = [
    {
      competition: {
        value: {
          label: "総計",
        },
      },
      total: {
        value: {
          label: String(sum.total),
        },
        className: sum.total === 0 ? "text-gray-300" : undefined,
      },
      win: {
        value: {
          label: String(sum.win),
        },
        className: sum.win === 0 ? "text-gray-300" : undefined,
      },
      draw: {
        value: {
          label: String(sum.draw),
        },
        className: sum.draw === 0 ? "text-gray-300" : undefined,
      },
      lose: {
        value: {
          label: String(sum.lose),
        },
        className: sum.lose === 0 ? "text-gray-300" : undefined,
      },
      winRate: {
        value: {
          label:
            sum.total === 0
              ? ""
              : `${String(winRate(sum.win, sum.total).toFixed(1))}%`,
        },
        className: sum.total === 0 ? "text-gray-300" : undefined,
      },
    },
  ];

  return footerRows;
};

export const createTopPanelItems = (
  teamId: string,
  matches: MatchGet[],
): TopPanelItems => {
  const competitionRecords = createCompetitionRecords(teamId, matches);

  const sum = calcSum(competitionRecords);

  return {
    doughnut: { ...sum },
    table: {
      rows: createRows(competitionRecords),
      footerRows: createFooterRows(sum),
    },
  };
};
