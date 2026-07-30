import {
  InjuryPanel,
  NationalCallupPanel,
  PlayerRegistrationPanel,
  PositionPanel,
  TransferPanel,
} from "../panels/index";
import { PLAYER_TAB, UsePlayerSummary } from "../types";

const PanelRenderer = ({ summary }: { summary: UsePlayerSummary }) => {
  const {
    tab: { selectedTab },
  } = summary;

  switch (selectedTab) {
    case PLAYER_TAB.INJURY:
      return <InjuryPanel summary={summary} />;

    case PLAYER_TAB.PLAYER_REGISTRATION:
      return <PlayerRegistrationPanel summary={summary} />;

    case PLAYER_TAB.NATIONAL_CALLUP:
      return <NationalCallupPanel summary={summary} />;

    case PLAYER_TAB.POSITION:
      return <PositionPanel summary={summary} />;

    case PLAYER_TAB.TRANSFER:
      return <TransferPanel summary={summary} />;

    default:
      return null;
  }
};

export default PanelRenderer;
