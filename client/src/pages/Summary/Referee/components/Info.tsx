import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { ModelType } from "../../../../types/models";
import { UseRefereeSummary } from "../types";
import { FullScreenLoader } from "../../../../components/ui";
import { useModal } from "../../../../context/modal-context";
import { getLinkFields } from "../../../../lib/model-link-fields";
import { convertToDisplayListData } from "../../../../components/modals/Detail/utils/convertToDisplayListData ";

const linkField = getLinkFields(ModelType.REFEREE);

const Info = ({ summary }: { summary: UseRefereeSummary }) => {
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
                open(
                  ModelType.REFEREE,
                  selected._id,
                  convertToDisplayListData({
                    data: selected,
                    model: { modelType: ModelType.REFEREE, linkField },
                  }),
                );
              }}
            >
              {selected.name}
            </div>
            <div className="text-gray-600">{selected.en_name}</div>
            <div className="text-sm text-gray-500">
              生年月日：{toDateKey(selected.dob as string | number | Date)}
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
