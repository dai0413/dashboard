import { ModelTableContainer } from "../../components/table";
import { useInjury } from "../../context/models/injury";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ColumnType } from "../../types/table";

const Injury = () => {
  const injuryContext = useInjury();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"負傷情報"}
        headers={[
          { label: "発表日", field: "doa", type: ColumnType.FIELD, id: "doa" },
          { label: "所属", field: "team", type: ColumnType.FIELD, id: "team" },
          {
            label: "名前",
            field: "player",
            type: ColumnType.FIELD,
            id: "player",
          },
          {
            label: "負傷箇所・診断結果",
            field: "injured_part",
            type: ColumnType.FIELD,
            id: "injured_part",
          },
          {
            label: "全治",
            field: "ttp",
            width: "80px",
            type: ColumnType.FIELD,
            id: "ttp",
          },
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
