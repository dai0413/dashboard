import { useEffect, useMemo } from "react";
import { useJapaneseInEuropePage } from "../context/japaneseInEurope-context";
import { FullScreenLoader } from "../components/ui";
import { APP_ROUTES } from "../lib/appRoutes";
import { RenderCellValue } from "../types/table";
import { GroupedSummaryItems, SummaryItem } from "../types/summaryItem";
import { SummaryCard } from "../components/summary/SummaryCard";
import { convert } from "../lib/convert/CreateLabel";
import { ModelType } from "../types/models";
import { NationalitySquadResult } from "@dai0413/myorg-shared/types/aggregate/player";

const countryOrder = [
  "イングランド",
  "スペイン",
  "ドイツ",
  "フランス",
  "イタリア",
  "ポルトガル",
  "オランダ",
  "ベルギー",
  "スコットランド",
];

type Params = {
  data: NationalitySquadResult[];
  seasonStart: Date;
  seasonEnd: Date;
};

const convertGroupedSummaryItems = ({
  data,
  seasonStart,
  seasonEnd,
}: Params): GroupedSummaryItems[] => {
  const grouped = new Map<
    string,
    {
      title: RenderCellValue;
      datas: {
        data: SummaryItem;
        level: string | undefined;
      }[];
    }
  >();

  for (const item of data) {
    const country = item.country;

    if (!country?._id) continue;

    const countryId = country._id;

    if (!grouped.has(countryId)) {
      grouped.set(countryId, {
        title: {
          label: country.name ?? "",
          to: `${APP_ROUTES.NATIONAL_SUMMARY}/${countryId}`,
        },
        datas: [],
      });
    }

    const player = item.player;
    const team = item.transfer.to_team;

    if (!player || !team) continue;

    const mainText = {
      label: `${convert(ModelType.PLAYER, player)}`,
      to: `${APP_ROUTES.PLAYER_SUMMARY}/${player._id}`,
    };

    const head = item.teamCompetitionSeason?.competition.level ?? "";

    const createTeamText = (data: { abbr?: string; team: string }): string => {
      return data.abbr || data.team;
    };

    const subText = team._id
      ? {
          label: `${head} ${head ? ":" : ""} ${createTeamText(team)}`,
          to: `${APP_ROUTES.TEAM_SUMMARY}/${team._id}`,
        }
      : {
          label: `${head} ${head ? ":" : ""} ${createTeamText(team)}`,
        };

    const colors = [
      team.primaryColor,
      team.secondaryColor,
      team.tertiaryColor,
    ].filter((t) => typeof t === "string");

    const rightTop =
      item.nextTransfer && item.nextTransfer.to_team
        ? createTeamText(item.nextTransfer.to_team)
        : undefined;

    const leftTop =
      item.transfer &&
      item.transfer.from_team &&
      item.transfer.from_date &&
      item.transfer.form !== "更新" &&
      seasonStart.getTime() <= new Date(item.transfer.from_date).getTime() &&
      seasonEnd.getTime() >= new Date(item.transfer.from_date).getTime()
        ? createTeamText(item.transfer.from_team)
        : undefined;

    grouped.get(countryId)!.datas.push({
      data: {
        colors,
        mainText,
        subText,
        rightTop,
        leftTop,
      },
      level: item.teamCompetitionSeason?.competition?.level,
    });
  }

  // countryOrder にある国を優先し、必ずグループを生成する
  const result = countryOrder.map((countryName) => {
    const group = [...grouped.values()].find(
      (group) => group.title.label === countryName,
    );

    if (group) {
      return {
        title: group.title,
        summaryItems: group.datas
          .sort((a, b) => {
            const getLevelNumber = (level?: string) => {
              const match = level?.match(/\d+/);
              return match ? Number(match[0]) : Infinity;
            };

            return getLevelNumber(a.level) - getLevelNumber(b.level);
          })
          .map(({ data }) => data),
      };
    }

    // データが存在しない国も空グループとして生成
    return {
      title: {
        label: countryName,
      },
      summaryItems: [],
    };
  });

  // countryOrder にない国も末尾に追加
  const rankedCountryNames = new Set(countryOrder);

  const unrankedGroups = [...grouped.values()]
    .filter((group) => !rankedCountryNames.has(group.title.label))
    .sort((a, b) => a.title.label.localeCompare(b.title.label, "ja"))
    .map((group) => ({
      title: group.title,
      summaryItems: group.datas
        .sort((a, b) => {
          const getLevelNumber = (level?: string) => {
            const match = level?.match(/\d+/);
            return match ? Number(match[0]) : Infinity;
          };

          // 1. level順
          const levelDiff = getLevelNumber(a.level) - getLevelNumber(b.level);

          if (levelDiff !== 0) return levelDiff;

          // 2. subText.label順（undefinedは最後）
          const aLabel = a.data.subText?.label;
          const bLabel = b.data.subText?.label;

          if (aLabel == null) return bLabel == null ? 0 : 1;
          if (bLabel == null) return -1;

          return aLabel.localeCompare(bLabel, "ja", { numeric: true });
        })
        .map(({ data }) => data),
    }));

  return [...result, ...unrankedGroups];
};

const JapaneseInEurope = () => {
  const { isLoading, datas, readItems, seasonStart, seasonEnd } =
    useJapaneseInEuropePage();

  useEffect(() => {
    if (datas.length === 0) {
      readItems();
    }
  }, []);

  const groupedSummaryItems: GroupedSummaryItems[] = useMemo(() => {
    if (datas.length === 0) return [];

    const groupedSummaryItems = convertGroupedSummaryItems({
      data: datas,
      seasonStart,
      seasonEnd,
    });
    return groupedSummaryItems;
  }, [datas]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <section className="body-font bg-gray-50 text-gray-700">
      <div className="container mx-auto px-4 py-8 sm:px-6">
        <SummaryCard
          title="欧州組日本人一覧"
          text="ヨーロッパのクラブに所属する日本人を確認できます。"
          groupedSummaryItems={groupedSummaryItems}
        />
      </div>
    </section>
  );
};

export default JapaneseInEurope;
