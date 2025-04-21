import data from "../../test_data/players.json";
import { TableWithFilter, TableContainer } from "../components/table";
import { useFilter } from "../context/filter-context";

const Transfer = () => {
  const { filter } = useFilter();

  const filteredData = data.filter((item) => {
    // 名前がフィルター条件に含まれるかどうかでフィルタリング
    return item.name.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <TableContainer title={"移籍情報"}>
      <TableWithFilter
        data={filteredData}
        headers={[
          { label: "名前", field: "name" },
          { label: "生年月日", field: "dob" },
        ]}
      />
    </TableContainer>
  );
};

export default Transfer;
