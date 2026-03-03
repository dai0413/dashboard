import { ModelTableContainer } from "../../components/table";
import { useStatsL } from "../../context/models/stats-l";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { numberFields } from "@dai0413/myorg-shared";

const createField = () => {
  const fields = numberFields.map((key) => {
    return { label: key, field: key };
  });

  return fields;
};

const StatsL = () => {
  const statsLContext = useStatsL();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタッツL情報"}
        headers={[
          { label: "試合", field: "match" },
          { label: "チーム", field: "team" },
          ...createField(),
        ]}
        contextState={statsLContext}
        modelType={ModelType.STATS_L}
        linkField={[
          {
            field: "match",
            to: APP_ROUTES.MATCH_SUMMARY,
          },
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default StatsL;
