import { convertToDisplayListData } from "../../../../../components/modals/Detail/utils/convertToDisplayListData ";
import { FullScreenLoader } from "../../../../../components/ui";
import { useModal } from "../../../../../context/modal-context";
import { getLinkFields } from "../../../../../lib/model-link-fields";
import { ModelType } from "../../../../../types/models";
import { UseNationalTeamSummary } from "../types";

const linkField = getLinkFields(ModelType.TEAM);

const Info = ({ summary }: { summary: UseNationalTeamSummary }) => {
  const {
    detail: { open },
  } = useModal();

  const { selected, isLoading } = summary;

  return (
    <>
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(
                  ModelType.TEAM,
                  selected._id,
                  convertToDisplayListData({
                    data: selected,
                    model: { modelType: ModelType.TEAM, linkField },
                  }),
                );
              }}
            >
              {selected.team}
            </div>
            <div className="text-gray-600">{`${selected.enTeam}`}</div>
            <div className="text-gray-600">{`略称：${selected.abbr}`}</div>
            <div className="text-sm text-gray-500">
              {`国：${selected.country?.label}`}
            </div>
            <div className="text-sm text-gray-500">
              {`ジャンル：${selected.genre}`}
            </div>
            <div className="text-sm text-gray-500">
              {`年代：${selected.age_group}`}
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
