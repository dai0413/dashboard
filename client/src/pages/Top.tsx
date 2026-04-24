import { useEffect } from "react";
import { APP_ROUTES } from "../lib/appRoutes";
import { CustomTableContainer } from "../components/table";
import { LinkButton } from "../components/buttons";
import { Arrow } from "../components/ui";
import { useTopPage } from "../context/top-page-context";
import { ColumnType } from "../types/table";

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
