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
import { useQuery } from "../context/query-context";

const NoNumber = () => {
  const api = useApi();
  const { page, setPage } = useQuery();

  const handlePageChange = (page: number) => {
    setPage("page", page);
  };
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

  const j1 = import.meta.env.VITE_J1_ID;
  const j2 = import.meta.env.VITE_J2_ID;
  const j3 = import.meta.env.VITE_J3_ID;

  const competitionParam = [j1, j2, j3].join(",");

  const readCurrentPlayers = () =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.AGGREGATE.NO_NUMBER,
      params: { competition: competitionParam, endDate: String(new Date()) },
      onSuccess: (items: Transfer[]) => {
        setPlayers(convert(ModelType.TRANSFER, items));
      },
      handleLoading: (time) => setLoading(time, "player"),
    });

  useEffect(() => {
    readCurrentPlayers();
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
        pageNum={page.page}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default NoNumber;
