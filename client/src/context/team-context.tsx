import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Team } from "../types/models";
import { APIError } from "../types/types";
import api from "../lib/axios";
import { API_ROUTES } from "../lib/apiRoutes";
import { useModalAlert } from "./modal-alert-context";

type TeamState = {
  teams: Team[];
};

const TeamContext = createContext<TeamState>({ teams: [] });

const TeamProvider = ({ children }: { children: ReactNode }) => {
  const { handleSetAlert } = useModalAlert();
  const [teams, setTeams] = useState<Team[]>([]);

  const readAllTeam = async () => {
    let alertData: string | APIError | null = null;
    try {
      const res = await api.get(API_ROUTES.TEAM.GET_ALL);
      const teams = res.data.data as Team[];
      setTeams(teams);
      alertData = res.data?.message;
    } catch (err: any) {
      alertData = err.response?.data as APIError;
    } finally {
      handleSetAlert(alertData);
    }
  };

  useEffect(() => {
    readAllTeam();
  }, []);

  const value = {
    teams,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};

export { useTeam, TeamProvider };
