import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useCompetition } from "../../context/models/competition-context";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Competition = () => {
  const competitionContext = useCompetition();
  const { isOpen } = useForm();

  useEffect(() => {
    competitionContext.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"大会情報"}
        headers={[
          { label: "大会名", field: "abbr" },
          { label: "国", field: "country", width: "70px" },
          { label: "大会規模", field: "competition_type", width: "90px" },
          { label: "大会タイプ", field: "category", width: "100px" },
          { label: "年代", field: "age_group", width: "70px" },
        ]}
        contextState={competitionContext}
        modelType={ModelType.COMPETITION}
        // linkField={[
        //   {
        //     field: "name",
        //     to: APP_ROUTES.NATIONAL_SUMMARY,
        //   },
        // ]}
      />
    </div>
  );
};

export default Competition;
