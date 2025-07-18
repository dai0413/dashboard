import { useEffect } from "react";
import { APP_ROUTES } from "../lib/appRoutes";
import { Table } from "../components/table";
import { LinkButton } from "../components/buttons";
import { Arrow } from "../components/ui";

import { useTopPage } from "../context/top-page-context";

const Main = () => {
  const { transfers, injuries, readItems } = useTopPage();

  useEffect(() => {
    readItems();
  }, []);

  return (
    <section className="h-[50rem] text-gray-600 body-font flex items-center">
      <div className="container px-5 mx-auto mt-20">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/2 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl w-full mx-auto">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {"移籍情報"}
              </h2>
              <Table
                data={transfers}
                headers={[
                  { label: "発表日", field: "doa" },
                  { label: "移籍元", field: "from_team" },
                  { label: "移籍先", field: "to_team" },
                  { label: "名前", field: "player" },
                ]}
              />
              <div className="mb-4"></div>
              <LinkButton to={APP_ROUTES.TRANSFER} color={"green"}>
                <>
                  詳細へ
                  <Arrow />
                </>
              </LinkButton>
            </div>
          </div>

          <div className="w-full lg:w-1/2 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl w-full mx-auto">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {"怪我情報"}
              </h2>

              <Table
                data={injuries}
                headers={[
                  { label: "発表日", field: "doa" },
                  { label: "名前", field: "player" },
                  { label: "負傷箇所", field: "injured_part" },
                ]}
              />
              <div className="mb-4"></div>
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
