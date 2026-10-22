import { useEffect, useMemo } from "react";
import { useJapaneseInEuropePage } from "../context/japaneseInEurope-context";
import { FullScreenLoader } from "../components/ui";
import { APP_ROUTES } from "../lib/appRoutes";
import { RenderCellValue } from "../types/table";
import { NationalitySquadResult } from "../types/japaneseInEurope";
import { GroupedSummaryItems, SummaryItem } from "../types/summaryItem";
import { SummaryCard } from "../components/summary/SummaryCard";
import { convert } from "../lib/convert/CreateLabel";
import { ModelType } from "../types/models";

const convertGroupedSummaryItems = (
  data: NationalitySquadResult[],
): GroupedSummaryItems[] => {
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

    const subText = team._id
      ? {
          label: `${head} ${head ? ":" : ""} ${team.abbr || team.team}`,
          to: `${APP_ROUTES.TEAM_SUMMARY}/${team._id}`,
        }
      : {
          label: `${head} ${head ? ":" : ""} ${team.abbr || team.team}`,
        };

    const colors = [
      team.primaryColor,
      team.secondaryColor,
      team.tertiaryColor,
    ].filter((t) => typeof t === "string");

    grouped.get(countryId)!.datas.push({
      data: {
        colors,
        mainText,
        subText,
      },
      level: item.teamCompetitionSeason?.competition?.level,
    });
  }

  return [...grouped.values()].map((group) => ({
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
  }));
};

const JapaneseInEurope = () => {
  const { isLoading, datas, readItems } = useJapaneseInEuropePage();

  useEffect(() => {
    if (datas.length === 0) {
      readItems();
    }
  }, []);

  const groupedSummaryItems: GroupedSummaryItems[] = useMemo(() => {
    if (datas.length === 0) return [];

    const groupedSummaryItems = convertGroupedSummaryItems(datas);
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
