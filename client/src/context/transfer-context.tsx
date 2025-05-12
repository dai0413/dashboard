import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Transfer, TransferForm } from "../types/models";
import { API_ROUTES } from "../lib/apiRoutes";
import api from "../lib/axios";
import { useAlert } from "./alert-context";
import { APIError } from "../types/types";

import data from "../../test_data/transfers.json";
import { transformTransfers } from "../../test_data/parseDates";

const initialNewTransfer: TransferForm = {
  doa: null,
  from_team: null,
  to_team: null,
  player: null,
  position: null,
  form: null,
  number: null,
  from_date: null,
  to_date: null,
  URL: null,
};

type TransferState = {
  transfers: Transfer[];
  selectedTransfer: Transfer | null;
  newTransfer: TransferForm;
  handleChoseTransferId: (id: string) => void;
  handleNewTransfer: (key: keyof TransferForm, value: string) => void;

  createTransfer: () => Promise<void>;
  readTransfer: (id: string) => Promise<void>;
  readAllTransfer: () => Promise<void>;
  updateTransfer: (id: string) => Promise<void>;
  deleteTransfer: (id: string) => Promise<void>;
};

const defaultValue = {
  transfers: transformTransfers(data) as Transfer[],
  selectedTransfer: null,
  newTransfer: initialNewTransfer,
  handleChoseTransferId: () => {},
  handleNewTransfer: () => {},

  createTransfer: async () => {},
  readTransfer: async () => {},
  readAllTransfer: async () => {},
  updateTransfer: async () => {},
  deleteTransfer: async () => {},
};

const TransferContext = createContext<TransferState>(defaultValue);

const TransferProvider = ({ children }: { children: ReactNode }) => {
  const { handleSetAlert } = useAlert();
  const [transfers, setTransfers] = useState<Transfer[]>(
    transformTransfers(data)
  );

  useEffect(() => {
    setTransfers(transformTransfers(data));
  }, [data]);

  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(
    null
  );
  const [newTransfer, setNewTransfer] =
    useState<TransferForm>(initialNewTransfer);

  const createTransfer = async () => {
    let alertData: string | APIError | null = null;
    try {
      const res = await api.post(API_ROUTES.TRANSFER.CREATE, newTransfer);
      const transfer = res.data.data as Transfer;
      setTransfers((prev) => [...prev, transfer]);
      setNewTransfer(initialNewTransfer);
      alertData = res.data?.message;
    } catch (err: any) {
      alertData = err.response?.data as APIError;
    } finally {
      handleSetAlert(alertData);
    }
  };

  const readAllTransfer = async () => {
    let alertData: string | APIError | null = null;
    try {
      const res = await api.get(API_ROUTES.TRANSFER.GET_ALL);
      const transfers = res.data.data as Transfer[];
      setTransfers(transfers);
      alertData = res.data?.message;
    } catch (err: any) {
      alertData = err.response?.data as APIError;
    } finally {
      handleSetAlert(alertData);
    }
  };

  const readTransfer = async (id: string) => {
    let alertData: string | APIError | null = null;
    try {
      const res = await api.get(API_ROUTES.TRANSFER.DETAIL(id));
      const transfer = res.data.data as Transfer;
      setSelectedTransfer(transfer);
      alertData = res.data?.message;
    } catch (err: any) {
      alertData = err.response?.data as APIError;
    } finally {
      handleSetAlert(alertData);
    }
  };

  const updateTransfer = async (id: string) => {
    let alertData: string | APIError | null = null;
    try {
      const res = await api.patch(
        API_ROUTES.TRANSFER.UPDATE(id),
        selectedTransfer
      );
      setTransfers((prev) =>
        prev.map((t) => (t._id === id ? res.data.data : t))
      );
      alertData = res.data?.message;
    } catch (err: any) {
      alertData = err.response?.data as APIError;
    } finally {
      handleSetAlert(alertData);
    }
  };

  const deleteTransfer = async (id: string) => {
    let alertData: string | APIError | null = null;
    try {
      const res = await api.delete(API_ROUTES.TRANSFER.DELETE(id));
      setTransfers((prev) => prev.filter((t) => t._id !== id));
      alertData = res.data?.message;
    } catch (err: any) {
      alertData = err.response?.data as APIError;
    } finally {
      handleSetAlert(alertData);
    }
  };

  const handleChoseTransferId = (id: string) => {
    const selectedTransfer = transfers.find((t) => t._id === id);
    setSelectedTransfer(selectedTransfer || null);
  };

  const handleNewTransfer = (key: keyof Transfer, value: string) => {
    setNewTransfer((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const value = {
    transfers,
    selectedTransfer,
    newTransfer,
    handleChoseTransferId,
    handleNewTransfer,

    createTransfer,
    readTransfer,
    readAllTransfer,
    updateTransfer,
    deleteTransfer,
  };

  return (
    <TransferContext.Provider value={value}>
      {children}
    </TransferContext.Provider>
  );
};

const useTransfer = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error("useFilter must be used within a TransferProvider");
  }
  return context;
};

export { useTransfer, TransferProvider };
