import { Tooltip } from "@mui/material";
import { CircleInfo } from "../type";
import { Circle } from "./Circle";

const MatrixCell = ({ appearances }: { appearances: CircleInfo[] }) => (
  <div className="flex flex-wrap justify-center gap-1">
    {appearances.map((appearance, i) => (
      <Tooltip key={i} title={appearance.toolTipTitle} arrow>
        <span>
          <Circle
            is_backup={appearance.is_backup}
            is_training_partner={appearance.is_training_partner}
            calledUp={appearance.calledUp}
            match={appearance.match}
            playerAppearance={appearance.playerAppearance}
            toolTipTitle={appearance.toolTipTitle}
          />
        </span>
      </Tooltip>
    ))}
  </div>
);

export default MatrixCell;
