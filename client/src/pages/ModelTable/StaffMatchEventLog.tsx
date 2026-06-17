import { ModelTableContainer } from "../../components/table";
import { useStaffMatchEventLog } from "../../context/models/staff-match-event-log";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const StaffMatchEventLog = () => {
  const staffMatchEventLogContext = useStaffMatchEventLog();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタッフの試合イベントログ"}
        contextState={staffMatchEventLogContext}
        modelType={ModelType.STAFF_MATCH_EVENT_LOG}
        linkField={[
          {
            field: "staff",
            to: APP_ROUTES.STAFF_SUMMARY,
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

export default StaffMatchEventLog;
