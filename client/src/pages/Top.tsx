import { useEffect } from "react";
import { APP_ROUTES } from "../lib/appRoutes";
import { ListView } from "../components/table";
import { LinkButton } from "../components/buttons";
import { Arrow } from "../components/ui";
import { useTopPage } from "../context/top-page-context";

const Main = () => {
  const { isLoading, transfers, injuries, readItems } = useTopPage();

  useEffect(() => {
    readItems();
  }, []);

  return (
    <section className="text-gray-600 body-font flex items-center">
      <div className="container px-5 mx-auto mt-20">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/2 px-4">
            <div className="bg-white shadow-lg rounded-lg pb-3 max-w-7xl w-full mx-auto">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {"移籍情報"}
              </h2>
              <ListView
                pageNation="client"
                data={transfers}
                headers={[
                  { label: "発表日", field: "doa" },
                  { label: "移籍元", field: "from_team" },
                  { label: "移籍先", field: "to_team" },
                  { label: "名前", field: "player" },
                ]}
                isLoading={isLoading}
              />
              <LinkButton to={APP_ROUTES.TRANSFER} color={"green"}>
                <>
                  詳細へ
                  <Arrow />
                </>
              </LinkButton>
            </div>
          </div>

          <div className="w-full lg:w-1/2 px-4">
            <div className="bg-white shadow-lg rounded-lg pb-3 max-w-7xl w-full mx-auto">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {"怪我情報"}
              </h2>

              <ListView
                pageNation="client"
                data={injuries}
                headers={[
                  { label: "発表日", field: "doa" },
                  { label: "名前", field: "player" },
                  { label: "負傷箇所", field: "injured_part" },
                ]}
                isLoading={isLoading}
              />
              <LinkButton to={APP_ROUTES.INJURY} color={"green"}>
                <>
                  詳細へ
                  <Arrow />
                </>
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
