import { useEffect, useState } from "react";
import { TableContainer } from "../components/table";
import { ModelType } from "../types/models";
import { useApi } from "../context/api-context";
import { Transfer, TransferGet } from "../types/models/transfer";
import { readItemsBase } from "../lib/api";
import { API_ROUTES } from "../lib/apiRoutes";
import { convert } from "../lib/convert/DBtoGetted";
import { fieldDefinition } from "../lib/model-fields";
import {
  FilterableFieldDefinition,
  isFilterable,
  isSortable,
  SortableFieldDefinition,
} from "../types/field";
import { APP_ROUTES } from "../lib/appRoutes";

const NoNumber = () => {
  const api = useApi();

  const [players, setPlayers] = useState<TransferGet[]>([]);
  const [playersIsLoading, setPlayersIsLoading] = useState<boolean>(false);

  const isLoadingSetters = {
    player: setPlayersIsLoading,
  };

  const setLoading = (
    time: "start" | "end",
    data: keyof typeof isLoadingSetters
  ) => {
    isLoadingSetters[data](time === "start");
  };

  const japan = import.meta.env.VITE_JPN_COUNTRY_ID;

  const readCurrentPlayers = (_id: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.AGGREGATE.NO_NUMBER,
      path: japan,
      params: { endDate: String(new Date()) },
      onSuccess: (items: Transfer[]) => {
        setPlayers(convert(ModelType.TRANSFER, items));
      },
      handleLoading: (time) => setLoading(time, "player"),
    });

  useEffect(() => {
    readCurrentPlayers(japan);
  }, []);

  const inTransfersOptions = {
    filterField: ModelType.TRANSFER
      ? (fieldDefinition[ModelType.TRANSFER]
          .filter(isFilterable)
          .filter(
            (file) => file.key !== "to_team"
          ) as FilterableFieldDefinition[])
      : [],
    sortField: ModelType.TRANSFER
      ? (fieldDefinition[ModelType.TRANSFER]
          .filter(isSortable)
          .filter(
            (file) => file.key !== "to_team"
          ) as SortableFieldDefinition[])
      : [],
  };

  return (
    <div className="p-6">
      <TableContainer
        items={players}
        title="背番号なし"
        headers={[
          { label: "加入日", field: "from_date" },
          { label: "選手", field: "player" },
          { label: "移籍先", field: "to_team" },
        ]}
        modelType={ModelType.TRANSFER}
        originalFilterField={inTransfersOptions.filterField}
        originalSortField={inTransfersOptions.sortField}
        formInitialData={{}}
        itemsLoading={playersIsLoading}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
          {
            field: "to_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default NoNumber;
