import { TableContainer } from "../components/table";
import { useFilter } from "../context/filter-context";
import { useTransfer, TransferProvider } from "../context/transfer-context";

import { useEffect } from "react";

const Transfer = () => {
  const { filter } = useFilter();
  const { transfers, newTransfer } = useTransfer();

  const filteredData = transfers;

  useEffect(() => {
    console.log("data in Transfer", filteredData.length, filteredData);
  }, [filteredData]);

  return (
    <TransferProvider>
      <TableContainer
        title={"移籍情報"}
        headers={[
          { label: "移籍日", field: "doa" },
          { label: "移籍元", field: "from_team" },
          { label: "移籍先", field: "to_team" },
          { label: "名前", field: "player" },
        ]}
        data={filteredData}
        formData={newTransfer}
      />
    </TransferProvider>
  );
};

export default Transfer;
