import React, { ReactNode } from "react";

interface TableContainerProps {
  title: string;
  children: ReactNode;
}

const TableContainer: React.FC<TableContainerProps> = ({ title, children }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default TableContainer;
