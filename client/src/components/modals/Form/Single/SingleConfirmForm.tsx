import { FormTypeMap, GettedModelDataMap } from "../../../../types/models";
import { useForm } from "../../../../context/form-context";
import { isEmptyObject } from "../../../../utils/data";
import { getDiffKeys } from "../../../../utils/comparison";
import { useAlert } from "../../../../context/alert-context";
import FieldList from "../../FieldList";
import { convertToDisplayListData } from "../../Detail/utils/convertToDisplayListData ";

const SingleConfirmForm = <T extends keyof FormTypeMap>() => {
  const {
    single: { state, originalData, stateLabel },
    steps: { formSteps, handleStep },
    displayableField,
  } = useForm<T>();

  const {
    modal: { alert },
  } = useAlert();

  const diffKeys = originalData ? getDiffKeys(originalData, state) : [];

  const isUpdated = !!alert.success && diffKeys.length > 0;
  const isChanged = !alert.success && diffKeys.length > 0;

  return (
    <div className="space-y-2 text-sm text-gray-700">
      {isUpdated && (
        <span className="text-sm text-red-600 font-medium">
          ※ 赤文字の値に変更しました
        </span>
      )}

      {isChanged && (
        <span className="text-sm text-red-600 font-medium">
          ※ 赤文字の値に変更します
        </span>
      )}

      {!isEmptyObject(state) && (
        <FieldList
          data={convertToDisplayListData({
            data: stateLabel as GettedModelDataMap[T],
            form: {
              displayableField,
              steps: formSteps,
              onEdit: handleStep,
              diffKeys: diffKeys,
            },
          })}
          isForm={true}
        />
      )}
    </div>
  );
};

export default SingleConfirmForm;
