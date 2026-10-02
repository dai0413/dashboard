import { positionColorMap } from "../../../../../../styles/colors";
import { DisplayPosition } from "../type";

export const displayPositions: DisplayPosition[] = [
  {
    key: "CF",
    position: "センターフォワード",
    color: positionColorMap.CF,
    positions: ["RCF", "LCF", "CF"],
  },
  {
    key: "WG",
    position: "ウイング",
    color: positionColorMap.WG,
    positions: ["RSH", "LSH", "RWG", "LWG"],
  },
  {
    key: "OM",
    position: "トップ下",
    color: positionColorMap.OM,
    positions: ["OM", "RST", "LST", "RIH", "LIH"],
  },
  {
    key: "CM",
    position: "ボランチ",
    color: positionColorMap.CM,
    positions: ["RCM", "LCM", "DM"],
  },
  {
    key: "WB",
    position: "ウイングバック",
    color: positionColorMap.WB,
    positions: ["RWB", "LWB"],
  },
  {
    key: "SB",
    position: "サイドバック",
    color: positionColorMap.SB,
    positions: ["RSB", "LSB"],
  },
  {
    key: "CB",
    position: "センターバック",
    color: positionColorMap.CB,
    positions: ["CB", "RCB", "LCB"],
  },
  {
    key: "GK",
    position: "ゴールキーパー",
    color: positionColorMap.GK,
    positions: ["GK"],
  },
];
