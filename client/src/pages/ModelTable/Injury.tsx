import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useInjury } from "../../context/models/injury-context";
import { ModelType } from "../../types/models";
import { useForm } from "../../context/form-context";
import { useFilter } from "../../context/filter-context";
import { APP_ROUTES } from "../../lib/appRoutes";

const Injury = () => {
  const injuryContext = useInjury();
  const { isOpen } = useForm();
  const { resetFilterConditions } = useFilter();

  useEffect(() => resetFilterConditions(), []);

  useEffect(() => {
    injuryContext.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"負傷情報"}
        headers={[
          { label: "発表日", field: "doa" },
          { label: "所属", field: "team" },
          { label: "名前", field: "player" },
          { label: "負傷箇所・診断結果", field: "injured_part" },
          { label: "全治", field: "ttp", width: "80px" },
        ]}
        contextState={injuryContext}
        modelType={ModelType.INJURY}
        linkField={[
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
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

export default Injury;
