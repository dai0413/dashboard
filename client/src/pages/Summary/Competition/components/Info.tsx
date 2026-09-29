import { useMemo } from "react";
import { ActionButtonList } from "../../../../components/buttons/ActionButtonList";
import { SelectField } from "../../../../components/field";
import { convertToDisplayListData } from "../../../../components/modals/Detail/utils/convertToDisplayListData ";
import { FullScreenLoader } from "../../../../components/ui";
import { useModal } from "../../../../context/modal-context";
import { getLinkFields } from "../../../../lib/model-link-fields";
import { ModelType } from "../../../../types/models";
import { FormMode, InputMode, StartFormArgs } from "../../../../types/types";
import { matchRelatedItems } from "../../../AdminDashboard/data";
import { UseCompetitionSummary } from "../types";

const linkField = getLinkFields(ModelType.COMPETITION);

const Info = ({ summary }: { summary: UseCompetitionSummary }) => {
  const {
    detail: { open },
  } = useModal();
  const { isLoading, selected } = summary;

  if (!summary.select) return;

  const { selectedOption, options, handleSelect } = summary.select;

  const actionButtonItems = useMemo(() => {
    return matchRelatedItems
      .filter(
        (i) =>
          !("updateAndCreate" in i.startFormArgs) ||
          ("updateAndCreate" in i.startFormArgs &&
            !i.startFormArgs.updateAndCreate),
      )
      .map((item) => {
        if (!selected || !("_id" in selected)) return;

        const startFormArgs: StartFormArgs<ModelType.MATCH> = {
          ...item.startFormArgs,
          modelType: ModelType.MATCH,
          formMode: FormMode.CREATE,
          inputMode: InputMode.MANY,
          initialData: {
            metaData: {
              competition: selected?._id,
              season: selectedOption?._id,
            },
          },
        };

        return {
          ...item,
          startFormArgs,
          formModelType: ModelType.MATCH,
        };
      })
      .filter((item) => item !== undefined);
  }, [matchRelatedItems, selected]);

  return (
    <>
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(
                  ModelType.COMPETITION,
                  selected._id,
                  convertToDisplayListData({
                    data: selected,
                    model: { modelType: ModelType.COMPETITION, linkField },
                  }),
                );
              }}
            >
              {selected.name}
            </div>
            <div className="w-full md:w-50">
              <SelectField
                type="text"
                value={selectedOption ? selectedOption?._id : ""}
                options={options}
                onChange={handleSelect}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <div className="text-gray-600">{selected.en_name}</div>
              {selected.country?.label ? (
                <div className="text-md text-gray-500">{`国：${selected.country.label}`}</div>
              ) : undefined}
              {selected.competition_type ? (
                <div className="text-md text-gray-500">{`大会タイプ：${selected.competition_type}`}</div>
              ) : undefined}
              {selected.category ? (
                <div className="text-md text-gray-500">{`カテゴリ：${selected.category}`}</div>
              ) : undefined}
              {selected.level ? (
                <div className="text-md text-gray-500">{`レベル：${selected.level}`}</div>
              ) : undefined}
              {selected.age_group ? (
                <div className="text-md text-gray-500">{`年代：${selected.age_group}`}</div>
              ) : undefined}
            </div>

            <ActionButtonList items={actionButtonItems} />
          </div>
        </div>
      ) : (
        <FullScreenLoader />
      )}
    </>
  );
};

export default Info;
