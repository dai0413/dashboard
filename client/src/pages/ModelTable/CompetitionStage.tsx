import { ModelTableContainer } from "../../components/table";
import { useCompetitionStage } from "../../context/models/competition-stage";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const Competition = () => {
  const context = useCompetitionStage();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"大会ステージ情報"}
        headers={[
          {
            label: "大会名",
            field: "competition",
            type: ColumnType.FIELD,
            id: "competition",
            defaultDisplay: true,
          },
          {
            label: "シーズン",
            field: "season",
            type: ColumnType.FIELD,
            id: "season",
            defaultDisplay: true,
          },
          {
            label: "ステージタイプ",
            field: "stage_type",
            type: ColumnType.FIELD,
            id: "stage_type",
            defaultDisplay: true,
          },
          {
            label: "名前",
            field: "name",
            type: ColumnType.FIELD,
            id: "name",
            defaultDisplay: true,
          },
          {
            label: "ラウンド",
            field: "round_number",
            type: ColumnType.FIELD,
            id: "round_number",
            defaultDisplay: true,
          },
          {
            label: "複数試合制",
            field: "leg",
            type: ColumnType.FIELD,
            id: "leg",
            defaultDisplay: true,
          },
        ]}
        contextState={context}
        modelType={ModelType.COMPETITION_STAGE}
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
