import { ModelTableContainer } from "../../components/table";
import { useTransfer } from "../../context/models/transfer";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Transfer = () => {
  const transferContext = useTransfer();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"移籍情報"}
        contextState={transferContext}
        modelType={ModelType.TRANSFER}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
          {
            field: "from_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
          {
            field: "to_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Transfer;
