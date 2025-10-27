import { useEffect } from "react";
import { ModelTableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useCompetitionStage } from "../../context/models/competition-stage";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Competition = () => {
  const context = useCompetitionStage();
  const { isOpen } = useForm();

  useEffect(() => {
    context.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"大会ステージ情報"}
        headers={[
          { label: "大会名", field: "competition" },
          { label: "シーズン", field: "season" },
          { label: "ステージタイプ", field: "stage_type" },
          { label: "名前", field: "name" },
          { label: "ラウンド", field: "round_number" },
          { label: "複数試合制", field: "leg" },
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
