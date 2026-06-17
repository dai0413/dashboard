import { useEffect } from "react";
import { APP_ROUTES } from "../lib/appRoutes";
import { CustomTableContainer } from "../components/table";
import { LinkButton } from "../components/buttons";
import { Arrow, FullScreenLoader } from "../components/ui";
import { useTopPage } from "../context/top-page-context";
import { ColumnType } from "../types/table";
import { Link } from "react-router-dom";
import { TeamGet } from "../types/models/team";

type TeamTipsProps = {
  title: string;
  items: TeamGet[];
  className?: string;
};

const TeamTips = ({ title, items, className }: TeamTipsProps) => {
  return (
    <div className={`${className ?? ""} py-5 w-full lg:w-1/2 px-4`}>
      <div className="bg-white shadow-lg rounded-lg pb-3 max-w-7xl w-full mx-auto">
        <h2 className="p-2 text-xl font-semibold text-gray-700 mb-4">
          {title}
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {items.map((team) => (
            <Link
              key={team._id}
              to={`${APP_ROUTES.TEAM_SUMMARY}/${team._id}`}
              className="
        p-2
        rounded-lg
        bg-gray-50
        border
        text-center
        hover:bg-green-50
        hover:border-green-500
        transition
      "
            >
              {team.abbr || team.team || team.enTeam}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

type HomeCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const HomeCard = ({ title, children, className }: HomeCardProps) => (
  <div className={`py-5 w-full lg:w-1/2 px-4 ${className ?? ""}`}>
    <div className="bg-white shadow-lg rounded-lg pb-3 max-w-7xl w-full mx-auto">
      <h2 className="p-2 text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      {children}
    </div>
  </div>
);

const Main = () => {
  const {
    isLoading,
    transfers,
    injuries,
    j1Teams,
    j2Teams,
    j3Teams,
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

  return (
    <section className="text-gray-600 body-font flex items-center">
      <div className="container px-5 mx-auto mt-20">
        <div className="flex flex-wrap -mx-4">
          <HomeCard title="移籍情報">
            <CustomTableContainer
              pageNation="client"
              items={transfers}
              fieldDefinitions={[
                {
                  label: "発表日",
                  field: "doa",
                  getValueType: ColumnType.FIELD,
                  key: "doa",
                  displayOnTable: true,
                  type: "Date",
                },
                {
                  label: "移籍元",
                  field: "from_team",
                  getValueType: ColumnType.FIELD,
                  key: "from_team",
                  displayOnTable: true,
                  type: "string",
                },
                {
                  label: "移籍先",
                  field: "to_team",
                  getValueType: ColumnType.FIELD,
                  key: "to_team",
                  displayOnTable: true,
                  type: "string",
                },
                {
                  label: "名前",
                  field: "player",
                  getValueType: ColumnType.FIELD,
                  key: "player",
                  displayOnTable: true,
                  type: "string",
                },
              ]}
              itemsLoading={isLoading}
              pageNum={1}
              noToolBar={false}
            />
            <LinkButton to={APP_ROUTES.TRANSFER} color={"green"}>
              <>
                詳細へ
                <Arrow />
              </>
            </LinkButton>
          </HomeCard>

          <HomeCard title="怪我情報">
            <CustomTableContainer
              pageNation="client"
              items={injuries}
              fieldDefinitions={[
                {
                  label: "発表日",
                  field: "doa",
                  getValueType: ColumnType.FIELD,
                  key: "doa",
                  displayOnTable: true,
                  type: "Date",
                },
                {
                  label: "名前",
                  field: "player",
                  getValueType: ColumnType.FIELD,
                  key: "player",
                  displayOnTable: true,
                  type: "string",
                },
                {
                  label: "負傷箇所",
                  field: "injured_part",
                  getValueType: ColumnType.FIELD,
                  key: "injured_part",
                  displayOnTable: true,
                  type: "string",
                },
              ]}
              itemsLoading={isLoading}
              pageNum={1}
              noToolBar={false}
            />
            <LinkButton to={APP_ROUTES.INJURY} color={"green"}>
              <>
                詳細へ
                <Arrow />
              </>
            </LinkButton>
          </HomeCard>

          <TeamTips title={"J1"} items={j1Teams} />
          <TeamTips title={"J2"} items={j2Teams} />
          <TeamTips title="J3" items={j3Teams} className="lg:w-full" />
        </div>
      </div>
    </section>
  );
};

export default Main;
