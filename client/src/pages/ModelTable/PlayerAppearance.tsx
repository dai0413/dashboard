import { ModelTableContainer } from "../../components/table";
import { usePlayerAppearance } from "../../context/models/player-appearance";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const PlayerAppearance = () => {
  const playerAppearanceContext = usePlayerAppearance();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"選手の出場履歴"}
        headers={[
          { label: "試合", field: "match" },
          { label: "選手", field: "player" },
          { label: "チーム", field: "team" },
          { label: "背番号", field: "number" },
          { label: "ステータス", field: "play_status" },
          { label: "ポジション", field: "position" },
          { label: "プレイ時間", field: "time" },
        ]}
        contextState={playerAppearanceContext}
        modelType={ModelType.PLAYER_APPEARANCE}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          {
            field: "match",
            to: APP_ROUTES.MATCH_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default PlayerAppearance;
