import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Team } from "../types/models/team";
import { APIError, ResponseStatus } from "../types/types";
import api from "../lib/axios";
import { API_ROUTES } from "../lib/apiRoutes";
import { useAlert } from "./alert-context";

type TeamState = {
  teams: Team[];
};

const TeamContext = createContext<TeamState>({ teams: [] });

const TeamProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();
  const [teams, setTeams] = useState<Team[]>([]);

  const readAllTeam = async () => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.get(API_ROUTES.TEAM.GET_ALL);
      const teams = res.data.data as Team[];
      setTeams(teams);
      alert = { success: true, message: res.data?.message };
    } catch (err: any) {
      const apiError = err.response?.data as APIError;

      alert = {
        success: false,
        errors: apiError.error?.errors,
        message: apiError.error?.message,
      };
    } finally {
      handleSetAlert(alert);
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
