import { ModelTableContainer } from "../../components/table";
import { useSeason } from "../../context/models/season";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const Competition = () => {
  const seasonContext = useSeason();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"シーズン情報"}
        headers={[
          {
            label: "大会名",
            field: "competition",
            type: ColumnType.FIELD,
            id: "competition",
          },
          {
            label: "シーズン",
            field: "name",
            width: "120px",
            type: ColumnType.FIELD,
            id: "name",
          },
          {
            label: "現在",
            field: "current",
            width: "70px",
            type: ColumnType.FIELD,
            id: "current",
          },
        ]}
        contextState={seasonContext}
        modelType={ModelType.SEASON}
        linkField={[
          {
            field: "competition",
            to: APP_ROUTES.COMPETITION_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Competition;
