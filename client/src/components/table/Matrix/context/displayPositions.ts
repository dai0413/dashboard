import { positionColorMap } from "../../../../styles/colors";
import { DisplayPosition } from "../type";

export const displayPositions: DisplayPosition[] = [
  {
    key: "CF",
    label: "センターフォワード",
    color: positionColorMap.CF,
    positions: ["RCF", "LCF", "CF"],
  },
  {
    key: "WG",
    label: "ウイング",
    color: positionColorMap.WG,
    positions: ["RSH", "LSH", "RWG", "LWG"],
  },
  {
    key: "OM",
    label: "トップ下",
    color: positionColorMap.OM,
    positions: ["OM", "RST", "LST", "RIH", "LIH"],
  },
  {
    key: "CM",
    label: "ボランチ",
    color: positionColorMap.CM,
    positions: ["RCM", "LCM", "DM"],
  },
  {
    key: "WB",
    label: "ウイングバック",
    color: positionColorMap.WB,
    positions: ["RWB", "LWB"],
  },
  {
    key: "SB",
    label: "サイドバック",
    color: positionColorMap.SB,
    positions: ["RSB", "LSB"],
  },
  {
    key: "CB",
    label: "センターバック",
    color: positionColorMap.CB,
    positions: ["CB", "RCB", "LCB"],
  },
  {
    key: "GK",
    label: "ゴールキーパー",
    color: positionColorMap.GK,
    positions: ["GK"],
  },
];
