import { Tooltip } from "@mui/material";
import { CircleInfo } from "../type";
import { Circle } from "./Circle";

const MatrixCell = ({ appearances }: { appearances: CircleInfo[] }) => {
  return (
    <div className="flex flex-wrap justify-center gap-1">
      {appearances.map((appearance, i) => {
        const className = appearance?.bgYellow ? "bg-yellow-100" : "";

        return (
          <Tooltip key={i} title={appearance.toolTipTitle} arrow>
            <span>
              <div className={`${className} px-2 py-1`}>
                <Circle
                  is_backup={appearance.is_backup}
                  is_training_partner={appearance.is_training_partner}
                  calledUp={appearance.calledUp}
                  match={appearance.match}
                  playerAppearance={appearance.playerAppearance}
                  toolTipTitle={appearance.toolTipTitle}
                  withdrawn={appearance.withdrawn}
                  declined={appearance.declined}
                  injured={appearance.injured}
                />
              </div>
            </span>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default MatrixCell;
