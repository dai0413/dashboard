import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { ModelType } from "../../../../types/models";
import { UseMatchSummary } from "../types";
import { FullScreenLoader } from "../../../../components/ui";
import { useModal } from "../../../../context/modal-context";

const Info = ({ summary }: { summary: UseMatchSummary }) => {
  const {
    detail: { open },
  } = useModal();
  const { isLoading, selected } = summary;
  return (
    <>
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(ModelType.MATCH, selected._id);
              }}
            >
              {`${selected.home_team.label}-${selected.away_team.label}`}
            </div>
            <div className="text-gray-600">{selected.competition.label}</div>
            {selected.competition_stage && (
              <div className="text-gray-600">
                {selected.competition_stage.label}
              </div>
            )}
            {selected.match_week && (
              <div className="text-gray-600">{`第${selected.match_week}節`}</div>
            )}
            <div className="text-sm text-gray-500">
              開催日：{toDateKey(selected.date)}
            </div>
          </div>
        </div>
      ) : (
        <FullScreenLoader />
      )}
    </>
  );
};

export default Info;
