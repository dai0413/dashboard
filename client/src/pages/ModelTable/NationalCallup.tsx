import { ModelTableContainer } from "../../components/table";
import { useNationalCallup } from "../../context/models/national-callup";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const NationalMatchSeries = () => {
  const context = useNationalCallup();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"代表招集リスト"}
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
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default NationalMatchSeries;
