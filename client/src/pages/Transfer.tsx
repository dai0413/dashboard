import { TableWithFilter, TableContainer } from "../components/table";
import { useFilter } from "../context/filter-context";
import { useTransfer } from "../context/transfer-context";

const Transfer = () => {
  const { filter } = useFilter();
  const { transfers } = useTransfer();

  const filteredData = transfers.filter((item) => {
    // 名前がフィルター条件に含まれるかどうかでフィルタリング
    return item.player.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <TableContainer title={"移籍情報"}>
      <TableWithFilter
        data={filteredData}
        headers={[
          { label: "移籍日", field: "from_date" },
          { label: "移籍元", field: "from_team" },
          { label: "移籍先", field: "to_team" },
          { label: "名前", field: "player" },
        ]}
      />
    </TableContainer>
  );
};

export default Transfer;
