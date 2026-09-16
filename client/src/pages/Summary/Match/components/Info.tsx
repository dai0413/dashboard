import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { ModelType } from "../../../../types/models";
import { UseMatchSummary } from "../types";
import { FullScreenLoader } from "../../../../components/ui";
import { useModal } from "../../../../context/modal-context";
import { getLinkFields } from "../../../../lib/model-link-fields";
import { convertToDisplayListData } from "../../../../components/modals/Detail/utils/convertToDisplayListData ";
import { matchRelatedItems } from "../../../AdminDashboard/data";
import { useForm } from "../../../../context/form-context";
import {
  FormMode,
  From,
  InputMode,
  StartFormArgs,
} from "../../../../types/types";
import { FormStep } from "../../../../types/form";
import { useAuth } from "../../../../context/auth-context";
import { isDev } from "../../../../utils/env";

const linkField = getLinkFields(ModelType.MATCH);

const items = matchRelatedItems.filter(
  (i) =>
    "updateAndCreate" in i.startFormArgs && i.startFormArgs.updateAndCreate,
);

const Info = ({ summary }: { summary: UseMatchSummary }) => {
  const {
    detail: { open },
    form: { open: formOpen },
  } = useModal();
  const { isLoading, selected } = summary;
  const { staffState } = useAuth();
  const {
    formOperator: { startForm },
  } = useForm();

  const handleClick = (steps?: FormStep<any>[]) => {
    if (!selected || !("_id" in selected)) return;

    const startFormArgs: StartFormArgs<ModelType.MATCH> = {
      steps: steps,
      modelType: ModelType.MATCH,
      from: From.SN_M,
      updateAndCreate: true,
      formMode: FormMode.UPDATE,
      inputMode: InputMode.MANY,
      editItem: [selected],
      ids: [selected._id],
      initialData: {
        metaData: {
          card_ids: selected?._id,
          match: selected?._id,
          competition: selected?.competition.id,
          season: selected?.season.id,
          competition_stage: selected?.competition_stage.id,
          match_week: selected?.match_week,
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
          <div className="flex justify-between items-center">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <div
                className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
                onClick={() => {
                  open(
                    ModelType.MATCH,
                    selected._id,
                    convertToDisplayListData({
                      data: selected,
                      model: { modelType: ModelType.MATCH, linkField },
                    }),
                  );
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
