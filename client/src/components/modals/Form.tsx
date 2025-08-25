import { LinkButtonGroup } from "../buttons";
import { Modal } from "../ui/index";
import { FormTypeMap } from "../../types/models";
import Alert from "../layout/Alert";
import { useAlert } from "../../context/alert-context";
import { useOptions } from "../../context/options-provider";
import { useForm } from "../../context/form-context";
import { useEffect, useState } from "react";
import { usePlayer } from "../../context/models/player-context";
import { useTeam } from "../../context/models/team-context";
import { useAuth } from "../../context/auth-context";
import { RenderField } from "./Form/Field";
import { RenderManyField } from "./Form/ManyField";
import { Table } from "../table";
import { useQuery } from "../../context/query-context";

const Form = <T extends keyof FormTypeMap>() => {
  const {
    mode,
    formOperator: { closeForm },
    isOpen,
    isEditing,
    newData,

    single,

    many,

    steps: { currentStep, nextStep, prevStep, nextData, sendData },

    getDiffKeys,
  } = useForm<T>();

  const {
    modal: { alert, resetAlert },
  } = useAlert();

  const { accessToken } = useAuth();

  const {
    metacrud: { readItems: readPlayers },
  } = usePlayer();
  const {
    metacrud: { readItems: readTeams },
  } = useTeam();
  const { page, setPage } = useQuery();

  useEffect(() => {
    if (!accessToken) return;
    readPlayers({});
    readTeams({});
  }, [accessToken]);

  const { getOptions } = useOptions();

  const diffKeys = getDiffKeys ? getDiffKeys() : [];

  const steps = mode === "single" ? single.formSteps : many?.formSteps;
  const handleFormData = single.handleFormData;

  const [isTableOpen, setIsTableOpen] = useState<boolean>(false);

  const confirmManyDataHeaders =
    steps?.flatMap((s) =>
      (s.fields ?? [])
        .map((field) => ({
          label: field.label,
          field: field.key as string,
          width: field.width,
          type: field.type,
        }))
        .filter((h) => (many?.formData ?? []).some((d) => h.field in d))
    ) ?? [];

  const confirmData = (many?.formData ?? []).map((d) => {
    const row: Record<string, string | number | undefined> = {};

    confirmManyDataHeaders.forEach((h) => {
      const key = h.field;
      const value = d[key as keyof typeof d];

      let displayValue: string | number | undefined;

      if (h.type === "select" || h.type === "table") {
        const options = getOptions(key);
        const selected = options?.find((opt) => opt.key === value);
        displayValue = selected?.label || "";
      } else if (typeof value === "boolean") {
        displayValue = value ? "◯" : "";
      } else if (value === null || value === undefined) {
        displayValue = "";
      } else {
        displayValue = value as string | number;
      }

      row[key] = displayValue;
    });

    return row;
  });

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

      {!steps || steps.length === 0 ? null : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            ステップ {currentStep + 1} / {steps.length}：
            {steps[currentStep].stepLabel}
          </div>

          <div className="flex space-x-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>

          {steps[currentStep].type === "confirm" ? (
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

              {mode === "single" &&
                Object.entries(single.formData).map(([key, value]) => {
                  if (
                    key === "_id" ||
                    key === "__v" ||
                    key === "createdAt" ||
                    key === "updatedAt"
                  )
                    return;

                  const field = steps
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
                    <div
                      key={key}
                      className="flex justify-between border-b py-1"
                    >
                      <span className="font-semibold">
                        {field?.label ?? key}
                      </span>
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
              {mode === "many" && (
                <>
                  {many?.renderConfirmMes(confirmData)}

                  <Table
                    data={confirmData || []}
                    headers={confirmManyDataHeaders || []}
                    currentPage={page.formPage}
                    onPageChange={(p: number) => setPage("formPage", p)}
                    itemsPerPage={10}
                  />
                </>
              )}
            </div>
          ) : steps[currentStep].many && many ? (
            <RenderManyField
              isTableOpen={isTableOpen}
              toggleTableOpen={() => setIsTableOpen((prev) => !prev)}
            />
          ) : (
            steps[currentStep].fields &&
            steps[currentStep].fields.map((field) => (
              <div key={field.key as string} className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  {field.label}
                </label>
                <RenderField
                  key={field.key as string}
                  field={field}
                  formData={single.formData}
                  handleFormData={handleFormData}
                />
              </div>
            ))
          )}

          <div className="mt-4">
            {isTableOpen ? (
              <LinkButtonGroup
                deny={{
                  text: "戻る",
                  color: "red",
                  onClick: () => setIsTableOpen(false),
                }}
              />
            ) : currentStep === steps.length - 1 && !isEditing ? (
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
                    currentStep === steps.length - 1
                      ? newData
                        ? "追加"
                        : "変更"
                      : "次へ",
                  color: "green",
                  onClick:
                    currentStep === steps.length - 1 ? sendData : nextStep,
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
