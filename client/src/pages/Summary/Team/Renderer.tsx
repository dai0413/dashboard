import { useTeam } from "../../../context/models/team";
import { ClubTeam } from "./ClubTeam";
import { NationalTeam } from "./NationalTeam";

export const Team = () => {
  const {
    metacrud: { selected },
  } = useTeam();

  if (selected?.genre === "代表") {
    return <NationalTeam />;
  }

  return <ClubTeam />;
};
