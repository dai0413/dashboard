import { ModelTableContainer } from "../../components/table";
import { useTransfer } from "../../context/models/transfer";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const Transfer = () => {
  const transferContext = useTransfer();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"移籍情報"}
        headers={[
          { label: "発表日", field: "doa", type: ColumnType.FIELD, id: "doa" },
          {
            label: "名前",
            field: "player",
            type: ColumnType.FIELD,
            id: "player",
          },
          {
            label: "移籍元",
            field: "from_team",
            type: ColumnType.FIELD,
            id: "from_team",
          },
          {
            label: "移籍先",
            field: "to_team",
            type: ColumnType.FIELD,
            id: "to_team",
          },
          { label: "形態", field: "form", type: ColumnType.FIELD, id: "form" },
          {
            label: "加入日",
            field: "from_date",
            type: ColumnType.FIELD,
            id: "from_date",
          },
        ]}
        contextState={transferContext}
        modelType={ModelType.TRANSFER}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
          {
            field: "from_team",
            to: APP_ROUTES.TEAM_SUMMARY,
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

export default Transfer;
