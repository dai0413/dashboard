import { JSX, ReactNode } from "react";

export const Confirm = ({
  children,
  count,
}: {
  children?: ReactNode;
  count: number;
}): JSX.Element => {
  return (
    <div className="mb-4 text-sm text-gray-700 space-y-1">
      <div>
        <span>{`追加するデータは `}</span>
        <span className="font-bold">{`${count} 件`}</span>
        <span>{`です`}</span>
      </div>
      {children}
    </div>
  );
};
