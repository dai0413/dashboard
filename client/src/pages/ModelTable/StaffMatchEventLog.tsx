import { ModelTableContainer } from "../../components/table";
import { useStaffMatchEventLog } from "../../context/models/staff-match-event-log";
import { ModelType } from "../../types/models";

const StaffMatchEventLog = () => {
  const staffMatchEventLogContext = useStaffMatchEventLog();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"スタッフの試合イベントログ"}
        contextState={staffMatchEventLogContext}
        modelType={ModelType.STAFF_MATCH_EVENT_LOG}
      />
    </div>
  );
};

export default StaffMatchEventLog;
