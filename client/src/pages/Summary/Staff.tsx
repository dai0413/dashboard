import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { API_PATHS } from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { TableWithFetch } from "../../components/table";
import { useStaff } from "../../context/models/staff";
import { ModelType } from "../../types/models";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable } from "../../types/field";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useModal } from "../../context/modal-context";
import { ColumnType } from "../../types/table";
import { SummaryTabItems } from "../../types/menu/IconButton";
import SummaryTabMenu from "./components/SummaryTabMenu";

const tabItems: SummaryTabItems[] = [
  {
    icon: "registration",
    key: "registration",
    text: "スタッフ登録",
  },
];

const Staff = () => {
  const { id } = useParams();
  const {
    detail: { open },
    form: { isOpen: formIsOpen },
  } = useModal();

  const [selectedTab, setSelectedTab] = useState("registration");

  const {
    metacrud: { selected, readItem, isLoading },
  } = useStaff();

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
    })();
  }, [id, formIsOpen]);

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as string);
  };

  const formInitialData = useMemo(() => {
    if (!id) return {};
    return { staff: id };
  }, [id]);

  return (
    <div className="p-6">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(ModelType.STAFF, selected._id);
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

      <SummaryTabMenu
        items={tabItems}
        selectedTab={selectedTab}
        onChange={handleSelectedTab}
      />

      {/* コンテンツ表示 */}

      {selectedTab === "registration" && id && (
        <TableWithFetch
          modelType={ModelType.STAFF_REGISTRATION}
          fieldDefinitions={[
            {
              label: "シーズン",
              field: "season",
              getValueType: ColumnType.FIELD,
              key: "season",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "大会",
              field: "competition",
              getValueType: ColumnType.FIELD,
              key: "competition",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "日付",
              field: "date",
              getValueType: ColumnType.FIELD,
              key: "date",
              displayOnTable: true,
              type: "Date",
            },
            {
              label: "チーム",
              field: "team",
              getValueType: ColumnType.FIELD,
              key: "team",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "登録・抹消",
              field: "registration_type",
              getValueType: ColumnType.FIELD,
              key: "registration_type",
              displayOnTable: true,
              type: "select",
            },
            {
              label: "登録・抹消",
              field: "registration_status",
              getValueType: ColumnType.FIELD,
              key: "registration_status",
              displayOnTable: true,
              type: "select",
            },
          ]}
          fetch={{
            apiRoute: API_PATHS.STAFF_REGISTRATION.ROOT,
            params: {
              getAll: true,
              staff: id,
              sort: "-date,-competition,-registration_type",
            },
          }}
          filterField={fieldDefinition[ModelType.STAFF_REGISTRATION]
            ?.filter(isFilterable)
            .filter((file) => file.key !== "staff")}
          sortField={fieldDefinition[ModelType.STAFF_REGISTRATION]
            ?.filter(isSortable)
            .filter((file) => file.key !== "staff")}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
            { field: "competition", to: APP_ROUTES.COMPETITION_SUMMARY },
          ]}
          initialData={{ formData: formInitialData }}
        />
      )}
    </div>
  );
};

export default Staff;
