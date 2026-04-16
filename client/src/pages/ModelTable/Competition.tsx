import { ModelTableContainer } from "../../components/table";
import { useCompetition } from "../../context/models/competition";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const Competition = () => {
  const competitionContext = useCompetition();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"大会情報"}
        headers={[
          {
            label: "大会名",
            field: "name",
            type: ColumnType.FIELD,
            id: "name",
          },
          {
            label: "国",
            field: "country",
            width: "70px",
            type: ColumnType.FIELD,
            id: "country",
          },
          {
            label: "大会規模",
            field: "competition_type",
            width: "90px",
            type: ColumnType.FIELD,
            id: "competition_type",
          },
          {
            label: "大会タイプ",
            field: "category",
            width: "100px",
            type: ColumnType.FIELD,
            id: "category",
          },
          {
            label: "年代",
            field: "age_group",
            width: "70px",
            type: ColumnType.FIELD,
            id: "age_group",
          },
        ]}
        contextState={competitionContext}
        modelType={ModelType.COMPETITION}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.COMPETITION_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Competition;
