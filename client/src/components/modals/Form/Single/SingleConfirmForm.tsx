import { FormTypeMap, GettedModelDataMap } from "../../../../types/models";
import { useForm } from "../../../../context/form-context";
import { isEmptyObject } from "../../../../utils/data";
import { getDiffKeys } from "../../../../utils/comparison";
import { useAlert } from "../../../../context/alert-context";
import FieldList from "../../FieldList";
import { convertToDisplayListData } from "../../Detail/utils/convertToDisplayListData ";
import { FormMode, InputMode } from "../../../../types/types";
import { useMemo } from "react";

const SingleConfirmForm = <T extends keyof FormTypeMap>() => {
  const {
    formMode,
    inputMode,
    single: { state, originalData, stateLabel },
    many,
    steps: { formSteps, handleStep },
    displayableField,
  } = useForm<T>();

  const {
    modal: { alert },
  } = useAlert();

  const { fieldListDisplayableField, fieldListData, diffKeys } = useMemo(() => {
    if (formMode === FormMode.CREATE) {
      if (inputMode === InputMode.SINGLE) {
        return {
          fieldListDisplayableField: displayableField,
          fieldListData: stateLabel,
          diffKeys: [],
        };
      } else if (
        inputMode === InputMode.MANY &&
        many &&
        !isEmptyObject(many.bulkCommonLabel)
      ) {
        return {
          fieldListDisplayableField: displayableField,
          fieldListData: many.bulkCommonLabel,
          diffKeys: [],
        };
      }
    } else if (formMode === FormMode.UPDATE) {
      if (inputMode === InputMode.SINGLE) {
        const diffKeys = originalData ? getDiffKeys(originalData, state) : [];
        return {
          fieldListDisplayableField: displayableField,
          fieldListData: stateLabel,
          diffKeys,
        };
      } else if (inputMode === InputMode.MANY && many && many.originalDatas) {
        return {
          fieldListDisplayableField: displayableField,
          fieldListData: many.bulkCommonLabel,
          diffKeys: [],
        };
      }
    }

    return { fieldListDisplayableField: [], fieldListData: {}, diffKeys: [] };
  }, [
    displayableField,
    originalData,
    state,
    stateLabel,
    many?.originalDatas,
    many?.bulkCommonLabel,
  ]);

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
            data: fieldListData as GettedModelDataMap[T],
            form: {
              displayableField: fieldListDisplayableField,
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
