import { useEffect, useMemo } from "react";
import { APP_ROUTES } from "../../lib/appRoutes";
import { DataViewContainer } from "../../components/dataView";
import { FullScreenLoader } from "../../components/ui";
import { useTopPage } from "../../context/top-page-context";
import { ViewMode } from "../../types/types";
import { HomeCard } from "../../components/summary";
import { competition, injury, transfer } from "./constants/fieldDefinitions";
import { SummaryCard } from "../../components/summary/SummaryCard";
import { GroupedSummaryItems } from "../../types/summaryItem";
import { TeamGet } from "../../types/models/team";

const j1 = import.meta.env.VITE_J1_ID;
const j2 = import.meta.env.VITE_J2_ID;
const j3 = import.meta.env.VITE_J3_ID;

type LeagueData = {
  id: string;
  title: string;
  teams: TeamGet[];
};

const createGroupedSummaryItem = (league: LeagueData): GroupedSummaryItems => {
  const { id, title, teams } = league;

  return {
    title: { label: title, to: `${APP_ROUTES.COMPETITION_SUMMARY}/${id}` },
    summaryItems: teams.map((team) => {
      const colors = [
        team.primaryColor,
        team.secondaryColor,
        team.tertiaryColor,
      ].filter((color): color is string => !!color);

      const label: string = team.abbr || team.team || team.enTeam || "";

      return {
        mainText: {
          label,
          to: `${APP_ROUTES.TEAM_SUMMARY}/${team._id}`,
        },
        colors,
      };
    }),
  };
};

const Top = () => {
  const {
    isLoading,
    transfers,
    injuries,
    j1Teams,
    j2Teams,
    j3Teams,
    currentCompetitions,
    readItems,
  } = useTopPage();

  useEffect(() => {
    if (
      transfers.length === 0 &&
      injuries.length == 0 &&
      j1Teams.length === 0
    ) {
      readItems();
    }
  }, []);

  const groupedSummaryItems: GroupedSummaryItems[] = useMemo(() => {
    const leagues = [
      { id: j1, title: "J1", teams: j1Teams },
      { id: j2, title: "J2", teams: j2Teams },
      { id: j3, title: "J3", teams: j3Teams },
    ];

    const groupedSummaryItems = leagues.map((league) =>
      createGroupedSummaryItem(league),
    );
    return groupedSummaryItems;
  }, [j1Teams, j2Teams, j3Teams]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <section className="body-font bg-gray-50 text-gray-700">
      <div className="container mx-auto px-4 py-8 sm:px-6">
        {/* ページタイトル */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            トップページ
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            大会・移籍・怪我・チーム情報を確認できます。
          </p>
        </div>

        {/* 大会・移籍・怪我 */}
        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
          <HomeCard title="開催中の大会">
            <div className="p-4">
              <DataViewContainer
                pageNation="client"
                totalCount={currentCompetitions.length}
                fieldDefinitions={competition}
                itemsLoading={isLoading}
                noToolBar={false}
                viewModes={[ViewMode.TABLE]}
                viewData={{
                  [ViewMode.TABLE]: currentCompetitions,
                }}
                linkField={[
                  {
                    field: "competition",
                    to: APP_ROUTES.COMPETITION_SUMMARY,
                  },
                ]}
              />
            </div>
          </HomeCard>

          <HomeCard to={`${APP_ROUTES.TRANSFER}`} title="移籍情報">
            <div className="p-4">
              <DataViewContainer
                pageNation="client"
                totalCount={transfers.length}
                fieldDefinitions={transfer}
                itemsLoading={isLoading}
                noToolBar={false}
                viewModes={[ViewMode.TABLE]}
                viewData={{
                  [ViewMode.TABLE]: transfers,
                }}
              />
            </div>
          </HomeCard>

          <HomeCard to={`${APP_ROUTES.INJURY}`} title="怪我情報">
            <div className="p-4">
              <DataViewContainer
                pageNation="client"
                totalCount={injuries.length}
                fieldDefinitions={injury}
                itemsLoading={isLoading}
                noToolBar={false}
                viewModes={[ViewMode.TABLE]}
                viewData={{
                  [ViewMode.TABLE]: injuries,
                }}
              />
            </div>
          </HomeCard>
        </div>

        {/* リーグ別チーム */}
        <SummaryCard
          title="Jリーグチーム一覧"
          text="各リーグの所属チームを確認できます。"
          groupedSummaryItems={groupedSummaryItems}
        />
      </div>
    </section>
  );
};

export default Top;
