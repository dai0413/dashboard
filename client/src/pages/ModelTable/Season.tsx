import { useEffect } from "react";
import { ModelTableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useSeason } from "../../context/models/season";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Competition = () => {
  const seasonContext = useSeason();
  const { isOpen } = useForm();

  useEffect(() => {
    seasonContext.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"シーズン情報"}
        headers={[
          { label: "大会名", field: "competition" },
          { label: "シーズン", field: "name", width: "120px" },
          { label: "現在", field: "current", width: "70px" },
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
