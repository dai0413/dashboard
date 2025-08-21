import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useTransfer } from "../../context/models/transfer-context";
import { ModelType } from "../../types/models";
import { useFilter } from "../../context/filter-context";

const Transfer = () => {
  const transferContext = useTransfer();
  const { isOpen } = useForm();
  const { resetFilterConditions } = useFilter();

  useEffect(() => resetFilterConditions(), []);
  useEffect(() => {
    transferContext.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"移籍情報"}
        headers={[
          { label: "発表日", field: "doa" },
          { label: "名前", field: "player" },
          { label: "移籍元", field: "from_team" },
          { label: "移籍先", field: "to_team" },
          { label: "形態", field: "form" },
          { label: "背番号", field: "number", width: "100px" },
        ]}
        contextState={transferContext}
        modelType={ModelType.TRANSFER}
      />
    </div>
  );
};

export default Transfer;
