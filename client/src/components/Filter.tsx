import React, { useState } from "react";

type FilterProps = {
  onFilterChange: (filter: string) => void;
};

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    onFilterChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={filterValue}
        onChange={handleFilterChange}
        placeholder="フィルター..."
        className="px-4 py-2 border rounded-md w-full"
      />
    </div>
  );
};

export default Filter;
