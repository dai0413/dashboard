import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Player } from "../types/models";
import { APIError, ResponseStatus } from "../types/types";
import api from "../lib/axios";
import { API_ROUTES } from "../lib/apiRoutes";
import { useAlert } from "./alert-context";

type PlayerState = {
  players: Player[];
};

const PlayerContext = createContext<PlayerState>({ players: [] });

const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();
  const [players, setPlayers] = useState<Player[]>([]);

  const readAllPlayer = async () => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.get(API_ROUTES.PLAYER.GET_ALL);
      const players = res.data.data as Player[];
      setPlayers(players);
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
    readAllPlayer();
  }, []);

  const value = {
    players,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};

export { usePlayer, PlayerProvider };
