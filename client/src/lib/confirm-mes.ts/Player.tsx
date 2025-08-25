import { PlayerForm } from "../../types/models/player";
import { Confirm } from "./Confirm";

export const player = (formDatas: PlayerForm[]) => {
  return <Confirm count={formDatas.length}></Confirm>;
};
