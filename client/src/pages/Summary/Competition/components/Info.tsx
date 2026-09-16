import { SelectField } from "../../../../components/field";
import { convertToDisplayListData } from "../../../../components/modals/Detail/utils/convertToDisplayListData ";
import { FullScreenLoader } from "../../../../components/ui";
import { useAuth } from "../../../../context/auth-context";
import { useForm } from "../../../../context/form-context";
import { useModal } from "../../../../context/modal-context";
import { getLinkFields } from "../../../../lib/model-link-fields";
import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import {
  FormMode,
  From,
  InputMode,
  StartFormArgs,
} from "../../../../types/types";
import { isDev } from "../../../../utils/env";
import { matchRelatedItems } from "../../../AdminDashboard/data";
import { UseCompetitionSummary } from "../types";

const linkField = getLinkFields(ModelType.COMPETITION);

const items = matchRelatedItems.filter(
  (i) =>
    !("updateAndCreate" in i.startFormArgs) ||
    ("updateAndCreate" in i.startFormArgs && !i.startFormArgs.updateAndCreate),
);

const Info = ({ summary }: { summary: UseCompetitionSummary }) => {
  const {
    detail: { open },
    form: { open: formOpen },
  } = useModal();
  const { isLoading, selected } = summary;
  const { staffState } = useAuth();
  const {
    formOperator: { startForm },
  } = useForm();

  if (!summary.select) return;

  const { selectedOption, options, handleSelect } = summary.select;

  const handleClick = (steps?: FormStep<any>[]) => {
    if (!selected || !("_id" in selected)) return;

    const startFormArgs: StartFormArgs<ModelType.MATCH> = {
      steps: steps,
      modelType: ModelType.MATCH,
      from: From.SN_M,
      updateAndCreate: true,
      formMode: FormMode.CREATE,
      inputMode: InputMode.MANY,
      initialData: {
        metaData: {
          competition: selected?._id,
          season: selectedOption?._id,
        },
      },
    };

    startForm(startFormArgs);
    formOpen(ModelType.MATCH);
  };

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

            {(staffState.admin || isDev) && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-sm">
                <span className="font-medium">データ取得</span>

                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <button
                      key={item.desc}
                      type="button"
                      className="px-2 py-1 border border-gray-300 rounded-md
                             hover:bg-gray-100 hover:border-gray-400
                             cursor-pointer"
                      onClick={() => handleClick(item.startFormArgs.steps)}
                    >
                      {item.startFormArgs.from}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <FullScreenLoader />
      )}
    </>
  );
};

export default Info;
