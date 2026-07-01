import { ReactNode } from "react";

export const RenderTeamCount = <
  T extends {
    team?: string;
  },
>(
  datas: T[],
): ReactNode => {
  const grouped = datas.reduce(
    (acc, d) => {
      const team = d.team || "未設定";
      (acc[team] ??= []).push(d);
      return acc;
    },
    {} as Record<string, T[]>,
  );

  return (
    <>
      {Object.entries(grouped).map(([team, members]) => (
        <div key={team}>
          {team}: {members.length}件
        </div>
      ))}
    </>
  );
};
