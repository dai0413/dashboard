import { ModelType } from "../types/models";
import { fieldDefinition } from "../lib/model-fields";
import { isFilterable, isSortable, UIFieldDefinition } from "../types/field";
import { APP_ROUTES } from "../lib/appRoutes";
import { API_PATHS } from "@dai0413/myorg-shared";
import { useEffect, useState } from "react";
import { Data } from "../types/types";
import { Transfer, TransferGet } from "../types/models/transfer";
import { readItemsBase } from "../lib/api";
import { api } from "../context/api-context";
import { convert } from "../lib/convert/DBtoGetted";
import TableClient from "../components/table/TableClient";

const j1 = import.meta.env.VITE_J1_ID;
const j2 = import.meta.env.VITE_J2_ID;
const j3 = import.meta.env.VITE_J3_ID;

const competitionParam = [j1, j2, j3].join(",");

const fields: UIFieldDefinition<TransferGet>[] =
  fieldDefinition[ModelType.TRANSFER] || [];

const NoNumber = () => {
  const [items, setItems] = useState<Data<TransferGet>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const reloadFun = async () => {
    const obj = await readItemsBase<Transfer[]>({
      apiInstance: api,
      backendRoute: API_PATHS.AGGREGATE.TRANSFER.NO_NUMBER,
      params: {
        getAll: true,
        competition: competitionParam,
        endDate: String(new Date()),
      },
      handleLoading: (time) => {
        setItems((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.TRANSFER, obj.data);

      setItems({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    reloadFun();
  }, []);

  return (
    <div className="p-6">
      <TableClient
        modelType={ModelType.NATIONAL_MATCH_SERIES}
        title="背番号なし"
        fieldDefinitions={fields}
        reloadFun={reloadFun}
        itemsLoading={items.isLoading}
        pageNum={1}
        items={items.data}
        filterField={fields
          ?.filter(isFilterable)
          .filter((file) => file.key !== "number")}
        sortField={fields
          ?.filter(isSortable)
          .filter((file) => file.key !== "number")}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
          {
            field: "to_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          {
            field: "from_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default NoNumber;
