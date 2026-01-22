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
        headers={[
          { label: "試合", field: "match" },
          { label: "チーム", field: "team" },
          { label: "イベントタイプ", field: "match_event_type" },
          { label: "スタッフ", field: "staff" },
          { label: "前後半", field: "period_label" },
          { label: "時間", field: "time_name" },
          { label: "特別時間", field: "special_time" },
        ]}
        contextState={staffMatchEventLogContext}
        modelType={ModelType.STAFF_MATCH_EVENT_LOG}
        linkField={[
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
