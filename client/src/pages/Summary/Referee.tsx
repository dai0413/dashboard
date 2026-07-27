import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { useReferee } from "../../context/models/referee";
import { ModelType } from "../../types/models";
import { FullScreenLoader } from "../../components/ui";
import { useModal } from "../../context/modal-context";
import { SummaryTabItems } from "../../types/menu/IconButton";
import SummaryTabMenu from "./components/SummaryTabMenu";

const tabItems: SummaryTabItems[] = [];

const Referee = () => {
  const { id } = useParams();
  const {
    detail: { open },
    form: { isOpen: formIsOpen },
  } = useModal();

  const [selectedTab, setSelectedTab] = useState("registration");

  const {
    metacrud: { selected, readItem, isLoading },
  } = useReferee();

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

  return (
    <div className="p-6">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(ModelType.REFEREE, selected._id);
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
    </div>
  );
};

export default Referee;
