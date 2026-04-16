import { ModelTableContainer } from "../../components/table";
import { useNationalCallup } from "../../context/models/national-callup";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const NationalMatchSeries = () => {
  const context = useNationalCallup();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"代表招集リスト"}
        headers={[
          {
            label: "代表試合シリーズ",
            field: "series",
            width: "250px",
            type: ColumnType.FIELD,
            id: "series",
          },
          {
            label: "選手",
            field: "player",
            type: ColumnType.FIELD,
            id: "player",
          },
          {
            label: "招集状況",
            field: "status",
            width: "100px",
            type: ColumnType.FIELD,
            id: "status",
          },
          {
            label: "背番号",
            field: "number",
            width: "100px",
            type: ColumnType.FIELD,
            id: "number",
          },
          {
            label: "ポジション",
            field: "position_group",
            width: "100px",
            type: ColumnType.FIELD,
            id: "position_group",
          },
        ]}
        contextState={context}
        modelType={ModelType.NATIONAL_CALLUP}
        linkField={[
          {
            field: "series",
            to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
          },
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default NationalMatchSeries;
