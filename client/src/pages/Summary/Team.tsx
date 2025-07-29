import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableContainer } from "../../components/table";
import { useTransfer } from "../../context/models/transfer-context";
import { useInjury } from "../../context/models/injury-context";

import { ModelType } from "../../types/models";
import { TeamTabItems } from "../../constants/menuItems";
import { IconButton } from "../../components/buttons";
import { SelectField } from "../../components/field";
import { OptionArray } from "../../context/options-provider";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import {
  FilterableFieldDefinition,
  isFilterable,
  isSortable,
  SortableFieldDefinition,
} from "../../types/field";
import { useTeam } from "../../context/models/team-context";
import { readItemsBase } from "../../lib/api";
import { useApi } from "../../context/api-context";
import { API_ROUTES } from "../../lib/apiRoutes";
import { Transfer, TransferGet } from "../../types/models/transfer";
import { convert } from "../../lib/convert/DBtoGetted";
import { ReadItemsParamsMap } from "../../types/api";
import { Injury, InjuryGet } from "../../types/models/injury";

const Tabs = TeamTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed")
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const Team = () => {
  const api = useApi();
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState("player");

  const { selected, readItem, isLoading: teamIsLoading } = useTeam();

  const [players, setPlayers] = useState<TransferGet[]>([]);
  const [playersIsLoading, setPlayersIsLoading] = useState<boolean>(false);
  const [inTransfers, setInTransfers] = useState<TransferGet[]>([]);
  const [inTransfersIsLoading, setInTransfersIsLoading] =
    useState<boolean>(false);
  const [outTransfers, setOutTransfers] = useState<TransferGet[]>([]);
  const [outTransfersIsLoading, setOutTransfersIsLoading] =
    useState<boolean>(false);
  const [onLoan, setOnLoan] = useState<TransferGet[]>([]);
  const [onLoanIsLoading, setOnLoanIsLoading] = useState<boolean>(false);
  const [futurePlayers, setFuturePlayers] = useState<TransferGet[]>([]);
  const [futurePlayersIsLoading, setFuturePlayersIsLoading] =
    useState<boolean>(false);
  const [injuries, setInjuries] = useState<InjuryGet[]>([]);
  const [injuriesIsLoading, setInjuriesIsLoading] = useState<boolean>(false);

  const handleLoading = (
    time: "start" | "end",
    data: "player" | "in" | "out" | "loan" | "future" | "injury"
  ) => {
    switch (data) {
      case "player":
        return time === "start"
          ? setPlayersIsLoading(true)
          : setPlayersIsLoading(false);
      case "in":
        return time === "start"
          ? setInTransfersIsLoading(true)
          : setInTransfersIsLoading(false);
      case "out":
        return time === "start"
          ? setOutTransfersIsLoading(true)
          : setOutTransfersIsLoading(false);
      case "loan":
        return time === "start"
          ? setOnLoanIsLoading(true)
          : setOnLoanIsLoading(false);
      case "future":
        return time === "start"
          ? setFuturePlayersIsLoading(true)
          : setFuturePlayersIsLoading(false);
      case "injury":
        return time === "start"
          ? setInjuriesIsLoading(true)
          : setInjuriesIsLoading(false);
    }
  };

  const readCurrentPlayers = (id: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.CURRENT_PLAYERS_BY_TEAM(id),
      params: { from_date_to: String(new Date()) },
      onSuccess: (items: Transfer[]) => {
        setPlayers(convert(ModelType.TRANSFER, items));
      },
      handleLoading: (time) => handleLoading(time, "player"),
    });

  const readFuturePlayers = (id: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.GET_ALL,
      params: { team: id, from_date_after: new Date() },
      onSuccess: (items: Transfer[]) => {
        setFuturePlayers(convert(ModelType.TRANSFER, items));
      },
      handleLoading: (time) => handleLoading(time, "future"),
    });

  const readCurrentLoans = (id: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.CURRENT_LOANS_BY_TEAM(id),
      onSuccess: (items: Transfer[]) => {
        setOnLoan(convert(ModelType.TRANSFER, items));
      },
      handleLoading: (time) => handleLoading(time, "loan"),
    });

  const readTransfers = (
    params: ReadItemsParamsMap[ModelType.TRANSFER],
    onSuccess: (data: Transfer[]) => void,
    type: "in" | "out"
  ) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.GET_ALL,
      params,
      onSuccess,
      handleLoading: (time) => handleLoading(time, type),
    });

  const readInjuries = (params: ReadItemsParamsMap[ModelType.INJURY]) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.INJURY.GET_ALL,
      params,
      onSuccess: (items: Injury[]) => {
        setInjuries(convert(ModelType.INJURY, items));
      },
      handleLoading: (time) => handleLoading(time, "injury"),
    });

  useEffect(() => {
    if (!id) return;
    readItem(id);
    readCurrentPlayers(id);
    readFuturePlayers(id);
    readTransfers(
      { to_team: id, form: "!更新" },
      (items: Transfer[]) => setInTransfers(convert(ModelType.TRANSFER, items)),
      "in"
    );
    readTransfers(
      { from_team: id },
      (items: Transfer[]) =>
        setOutTransfers(convert(ModelType.TRANSFER, items)),
      "out"
    );
    readCurrentLoans(id);
    readInjuries({ latest: true, now_team: id });
  }, [id]);

  const handleSelectedTab = (value: string | number | Date): void => {
    setSelectedTab(value as string);
  };

  const transferContext = useTransfer();
  const filterableField = ModelType.TRANSFER
    ? (fieldDefinition[ModelType.TRANSFER]
        .filter(isFilterable)
        .filter((file) => file.key !== "player") as FilterableFieldDefinition[])
    : [];
  const sortField = ModelType.TRANSFER
    ? (fieldDefinition[ModelType.TRANSFER]
        .filter(isSortable)
        .filter((file) => file.key !== "player") as SortableFieldDefinition[])
    : [];

  const injuryContext = useInjury();
  const injuryOptions = {
    filterableField: ModelType.INJURY
      ? (fieldDefinition[ModelType.INJURY]
          .filter(isFilterable)
          .filter(
            (file) => file.key !== "player"
          ) as FilterableFieldDefinition[])
      : [],
    sortField: ModelType.INJURY
      ? (fieldDefinition[ModelType.INJURY]
          .filter(isSortable)
          .filter((file) => file.key !== "player") as SortableFieldDefinition[])
      : [],
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header情報 */}
      {!teamIsLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="font-bold text-lg">{selected.team}</div>
            <div className="text-gray-600">{`略称：${selected.abbr}`}</div>
            <div className="text-sm text-gray-500">
              {`国：${selected.country}`}
            </div>
            <div className="text-sm text-gray-500">
              {`ジャンル：${selected.genre}`}
            </div>
          </div>
        </div>
      ) : (
        <FullScreenLoader />
      )}

      {/* タブメニュー */}
      <div className="mb-4 pb-2">
        {/* SP: select */}
        <div className="mt-4 block sm:hidden">
          <SelectField
            type="text"
            value={selectedTab}
            options={Tabs}
            onChange={handleSelectedTab}
          />
        </div>

        {/* PC: tabs */}
        <div className="hidden sm:flex gap-4 border-b border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            {TeamTabItems.map(({ icon, text, className }) => {
              const isActive = selectedTab === icon;
              return (
                <li key={text}>
                  <IconButton
                    icon={icon}
                    text={text}
                    color={isActive ? "green" : "gray"}
                    onClick={() => icon && setSelectedTab(icon)}
                    direction="horizontal"
                    className={`
                        px-4 py-2 border-b-2 
                        ${
                          isActive
                            ? "border-green-500 text-green-700 font-semibold"
                            : "border-transparent hover:border-gray-300"
                        }
                        ${className}
                    `}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* コンテンツ表示 */}
      {selectedTab === "player" && (
        <TableContainer
          items={players}
          headers={[
            { label: "背番号", field: "number" },
            { label: "選手", field: "player" },
            { label: "ポジション", field: "position" },
          ]}
          modelType={ModelType.TRANSFER}
          contextState={transferContext}
          filterField={filterableField}
          sortField={sortField}
          formInitialData={{ to_team: id }}
          itemsLoading={playersIsLoading}
        />
      )}

      {selectedTab === "future_in" && (
        <TableContainer
          items={futurePlayers}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "選手", field: "player" },
            { label: "移籍元", field: "from_team" },
            { label: "ポジション", field: "position" },
          ]}
          modelType={ModelType.TRANSFER}
          contextState={transferContext}
          filterField={filterableField}
          sortField={sortField}
          formInitialData={{ to_team: id }}
          itemsLoading={futurePlayersIsLoading}
        />
      )}

      {selectedTab === "transfer_in" && (
        <TableContainer
          items={inTransfers}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "選手", field: "player" },
            { label: "移籍元", field: "from_team" },
            { label: "形態", field: "form" },
          ]}
          modelType={ModelType.TRANSFER}
          contextState={transferContext}
          filterField={filterableField}
          sortField={sortField}
          formInitialData={{ to_team: id }}
          itemsLoading={inTransfersIsLoading}
        />
      )}

      {selectedTab === "transfer_out" && (
        <TableContainer
          items={outTransfers}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "選手", field: "player" },
            { label: "移籍先", field: "to_team" },
            { label: "形態", field: "form" },
          ]}
          modelType={ModelType.TRANSFER}
          contextState={transferContext}
          filterField={filterableField}
          sortField={sortField}
          formInitialData={{ from_team: id }}
          itemsLoading={outTransfersIsLoading}
        />
      )}

      {selectedTab === "loan" && (
        <TableContainer
          items={onLoan}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "選手", field: "player" },
            { label: "移籍先", field: "to_team" },
            { label: "形態", field: "form" },
          ]}
          modelType={ModelType.TRANSFER}
          contextState={transferContext}
          filterField={filterableField}
          sortField={sortField}
          formInitialData={{ from_team: id }}
          itemsLoading={onLoanIsLoading}
        />
      )}

      {selectedTab === "injury" && (
        <TableContainer
          items={injuries}
          headers={[
            { label: "発表日", field: "doa" },
            { label: "選手", field: "player" },
            { label: "負傷箇所・診断結果", field: "injured_part" },
            { label: "全治", field: "ttp" },
          ]}
          modelType={ModelType.INJURY}
          contextState={injuryContext}
          filterField={injuryOptions.filterableField}
          sortField={injuryOptions.sortField}
          formInitialData={{ team: id }}
          itemsLoading={injuriesIsLoading}
        />
      )}
    </div>
  );
};

export default Team;
