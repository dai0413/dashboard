import { Link } from "react-router-dom";
import { APP_ROUTES } from "../lib/appRoutes";
import { Table, TableContainer } from "../components/table";
import { LinkButton } from "../components/buttons";
import { Arrow } from "../components/ui";

import data from "../../test_data/players.json";

const Main = () => {
  return (
    <section className="h-[50rem] text-gray-600 body-font flex items-center">
      <div className="container px-5 mx-auto">
        <div className="flex flex-wrap -mx-4">
          {/* 移籍情報テーブル */}
          <div className="w-full md:w-1/2 px-4 mb-8">
            <TableContainer title="移籍情報">
              <>
                <Table
                  data={data}
                  headers={[
                    { label: "名前", field: "name" },
                    { label: "生年月日", field: "dob" },
                  ]}
                />
                <LinkButton to={APP_ROUTES.TRANSFER} color={"green"}>
                  <>
                    詳細へ
                    <Arrow />
                  </>
                </LinkButton>
              </>
            </TableContainer>
          </div>

          {/* 怪我情報テーブル */}
          <div className="w-full md:w-1/2 px-4 mb-8">
            <TableContainer title="怪我情報">
              <>
                <Table
                  data={data}
                  headers={[
                    { label: "名前", field: "name" },
                    { label: "生年月日", field: "dob" },
                  ]}
                />
                <Link
                  to={APP_ROUTES.INJURY}
                  className="mt-4 inline-flex items-center text-green-500 border-2 border-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg transition"
                >
                  詳細へ
                  <Arrow />
                </Link>
              </>
            </TableContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
