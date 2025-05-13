import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Transfer, TransferForm, TransferPost } from "../types/models";
import { API_ROUTES } from "../lib/apiRoutes";
import api from "../lib/axios";
import { useAlert } from "./alert-context";
import { APIError } from "../types/types";
import { FormStep } from "../types/form";

import data from "../../test_data/transfers.json";
import { transformTransfers } from "../lib/parseDates";
import { useTeam } from "./team-context";
import {
  createConfirmationStep,
  createTransferFormSteps,
} from "../lib/form-steps";

const initialFormData: TransferForm = {};

export type TransferState = {
  transfers: Transfer[];
  selectedTransfer: Transfer | null;
  formData: TransferForm;
  handleFormData: (key: keyof TransferForm, value: any) => void;
  resetFormData: () => void;
  formSteps: FormStep<TransferForm>[];
  setFormSteps: React.Dispatch<
    React.SetStateAction<FormStep<Partial<TransferPost>>[]>
  >;

  handleChoseTransferId: (id: string) => void;

  createTransfer: () => Promise<void>;
  readTransfer: (id: string) => Promise<void>;
  readAllTransfer: () => Promise<void>;
  updateTransfer: (id: string) => Promise<void>;
  deleteTransfer: (id: string) => Promise<void>;
};

const defaultValue = {
  transfers: transformTransfers(data) as Transfer[],
  selectedTransfer: null,
  formData: initialFormData,
  handleFormData: () => {},
  resetFormData: () => {},
  formSteps: [],
  setFormSteps: () => {},

  handleChoseTransferId: () => {},

  createTransfer: async () => {},
  readTransfer: async () => {},
  readAllTransfer: async () => {},
  updateTransfer: async () => {},
  deleteTransfer: async () => {},
};

const TransferContext = createContext<TransferState>(defaultValue);

const TransferProvider = ({ children }: { children: ReactNode }) => {
  const { handleSetAlert } = useAlert();
  const { teams } = useTeam();

  const [transfers, setTransfers] = useState<Transfer[]>(
    transformTransfers(data)
  );

  useEffect(() => {
    setTransfers(transformTransfers(data));
  }, [data]);

  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(
    null
  );
  const [formData, setFormData] = useState<TransferForm>(initialFormData);

  const [formSteps, setFormSteps] = useState<FormStep<TransferForm>[]>([]);

  useEffect(() => {
    const steps = [
      ...createTransferFormSteps([], teams),
      createConfirmationStep<TransferForm>(),
    ];
    setFormSteps(steps);
  }, [teams]);

  const createTransfer = async () => {
    let alertData: string | APIError | null = null;
    try {
      const res = await api.post(API_ROUTES.TRANSFER.CREATE, formData);
      const transfer = res.data.data as Transfer;
      setTransfers((prev) => [...prev, transfer]);
      setFormData(initialFormData);
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

  const handleFormData = (key: keyof Transfer, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFormData = () => {
    console.log("reseting");
    setFormData(initialFormData);
  };

  const value = {
    transfers,
    selectedTransfer,
    formData,
    handleFormData,
    resetFormData,
    formSteps,
    setFormSteps,

    handleChoseTransferId,

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
    throw new Error("useTransfer must be used within a TransferProvider");
  }
  return context;
};

export { useTransfer, TransferProvider };
