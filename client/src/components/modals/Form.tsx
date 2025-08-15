import { LinkButtonGroup } from "../buttons";
import { Modal } from "../ui/index";
import { FormTypeMap } from "../../types/models";
import Alert from "../layout/Alert";
import { useAlert } from "../../context/alert-context";
import { useOptions } from "../../context/options-provider";
import { useForm } from "../../context/form-context";
import { useEffect } from "react";
import { usePlayer } from "../../context/models/player-context";
import { useTeam } from "../../context/models/team-context";
import { useAuth } from "../../context/auth-context";
import { RenderField } from "./Form/Field";

const Form = <T extends keyof FormTypeMap>() => {
  const {
    newData,
    isOpen,
    isEditing,
    closeForm,

    prevStep,
    nextStep,
    nextData,
    sendData,

    currentStep,
    formData,
    formSteps,
    handleFormData,

    getDiffKeys,
  } = useForm<T>();

  const {
    modal: { alert, resetAlert },
  } = useAlert();

  const { accessToken } = useAuth();

  const { readItems: readPlayers } = usePlayer();
  const { readItems: readTeams } = useTeam();

  useEffect(() => {
    if (!accessToken) return;
    readPlayers({});
    readTeams({});
  }, [accessToken]);

  const { getOptions } = useOptions();

  const diffKeys = getDiffKeys ? getDiffKeys() : [];

  return (
    <Modal isOpen={isOpen} onClose={closeForm}>
      <Alert
        success={alert?.success || false}
        message={alert?.message}
        resetAlert={resetAlert}
      />
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        {newData ? "新規データ作成" : "既存データ編集"}
      </h3>

      {!formSteps || formSteps.length === 0 ? null : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            ステップ {currentStep + 1} / {formSteps.length}：
            {formSteps[currentStep].stepLabel}
          </div>

          <div className="flex space-x-2 mb-4">
            {formSteps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>

          {formSteps[currentStep].type === "form" &&
          formSteps[currentStep].fields ? (
            formSteps[currentStep].fields.map((field) => {
              return (
                <RenderField
                  key={field.key as string}
                  single={{ field, formData, handleFormData }}
                />
              );
            })
          ) : (
            // 確認ステップ
            <div className="space-y-2 text-sm text-gray-700">
              {!newData && alert.success && diffKeys.length > 0 && (
                <span className="text-sm text-red-600 font-medium">
                  ※ 赤文字の値に変更しました
                </span>
              )}

              {!newData && !alert.success && diffKeys.length > 0 && (
                <span className="text-sm text-red-600 font-medium">
                  ※ 赤文字の値に変更します
                </span>
              )}

              {Object.entries(formData).map(([key, value]) => {
                if (
                  key === "_id" ||
                  key === "__v" ||
                  key === "createdAt" ||
                  key === "updatedAt"
                )
                  return;

                const field = formSteps
                  .flatMap((step) => step.fields || [])
                  .find((f) => f.key === key);

                let displayValue = value;

                if (field?.type === "select" || field?.type === "table") {
                  const options = getOptions(key);
                  const selected = options?.find((opt) => opt.key === value);
                  displayValue = selected?.label || "未選択";
                }

                if (field?.type === "date" && value) {
                  try {
                    const date = new Date(value as string);
                    displayValue = new Intl.DateTimeFormat("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(date);
                  } catch {
                    // 無効な日付ならそのまま表示
                  }
                }

                if (field?.type === "multiurl" && value) {
                  const urls = value as string[];
                  displayValue = `${
                    urls.filter((u) => u.trim() !== "").length
                  }件`;
                }

                if (field?.type === "multiInput" && value) {
                  const inputs = value as string[];
                  displayValue = inputs.join(",");
                }

                return (
                  <div key={key} className="flex justify-between border-b py-1">
                    <span className="font-semibold">{field?.label ?? key}</span>
                    <span
                      className={
                        !newData && diffKeys.includes(key)
                          ? "text-red-500 font-semibold bg-red-50 px-1 rounded"
                          : ""
                      }
                    >
                      {String(displayValue)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4">
            {currentStep === formSteps.length - 1 && !isEditing ? (
              <LinkButtonGroup
                approve={{
                  text: "次のデータへ",
                  color: "green",
                  onClick: nextData,
                }}
                deny={{
                  text: "入力終了",
                  color: "red",
                  onClick: closeForm,
                }}
              />
            ) : (
              <LinkButtonGroup
                approve={{
                  text:
                    currentStep === formSteps.length - 1
                      ? newData
                        ? "追加"
                        : "変更"
                      : "次へ",
                  color: "green",
                  onClick:
                    currentStep === formSteps.length - 1 ? sendData : nextStep,
                }}
                deny={{
                  text: "戻る",
                  color: "red",
                  onClick: prevStep,
                  disabled: currentStep === 0,
                }}
              />
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default Form;
