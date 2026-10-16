import { useEffect } from "react";
import { APP_ROUTES } from "../../lib/appRoutes";
import { DataViewContainer } from "../../components/dataView";
import { FullScreenLoader } from "../../components/ui";
import { useTopPage } from "../../context/top-page-context";
import { ViewMode } from "../../types/types";
import { HomeCard } from "./components";
import { competition, injury, transfer } from "./constants/fieldDefinitions";
import { Link } from "react-router-dom";

const j1 = import.meta.env.VITE_J1_ID;
const j2 = import.meta.env.VITE_J2_ID;
const j3 = import.meta.env.VITE_J3_ID;

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

  if (isLoading) {
    return <FullScreenLoader />;
  }

  const leagues = [
    { id: j1, title: "J1", teams: j1Teams },
    { id: j2, title: "J2", teams: j2Teams },
    { id: j3, title: "J3", teams: j3Teams },
  ];

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
        <div className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Jリーグチーム一覧
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              各リーグの所属チームを確認できます。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {leagues.map((league) => (
              <HomeCard
                key={league.id}
                to={`${APP_ROUTES.COMPETITION_SUMMARY}/${league.id}`}
                title={league.title}
              >
                <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
                  {league.teams.map((team) => (
                    <Link
                      key={team._id}
                      to={`${APP_ROUTES.TEAM_SUMMARY}/${team._id}`}
                      className="flex min-h-11 min-w-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:border-green-500 hover:bg-green-50 hover:text-green-800"
                      title={team.team || team.enTeam || team.abbr}
                    >
                      <span className="truncate">
                        {team.abbr || team.team || team.enTeam}
                      </span>
                    </Link>
                  ))}
                </div>
                {league.teams.length === 0 && (
                  <p className="py-6 text-center text-sm text-gray-400">
                    チーム情報がありません。
                  </p>
                )}
              </HomeCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Top;
