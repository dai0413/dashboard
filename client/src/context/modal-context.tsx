import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ModelType } from "../types/models";
import { useAlert } from "./alert-context";
import { DisplayListItem } from "../types/detail";

type OpenDetailProps = {
  title: string;
  data: DisplayListItem[];
};

export type ModelDataModelState = {
  modelType: ModelType | null;
  isOpen: boolean;
  id: string | null;
  open: (modelType: ModelType, id: string) => void;
  close: () => void;
};

type ModalState = {
  detail: ModelDataModelState;
  calendarData: {
    title?: string;
    isOpen: boolean;
    data: DisplayListItem[];
    open: (props: OpenDetailProps) => void;
    close: () => void;
  };
  form: {
    modelType: ModelType | null;
    isOpen: boolean;
    id?: string | null;
    open: (modelType: ModelType, id?: string) => void;
    close: () => void;
  };
};

const ModalContext = createContext<ModalState | null>(null);

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [detailIsOpen, setDetailIsOpen] = useState<boolean>(false);
  const [detailModelType, setDetailModelType] = useState<ModelType | null>(
    null,
  );
  const [detailId, setDetailId] = useState<string | null>(null);

  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);
  const [formModelType, setFormModelType] = useState<ModelType | null>(null);
  const [formId, setFormId] = useState<string | null>(null);

  const [calendarDataIsOpen, setCalDetailIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [calendarDetailData, setCalendarDetailData] = useState<
    DisplayListItem[]
  >([]);

  const {
    modal: { handleSetAlert },
  } = useAlert();

  useEffect(() => {
    handleSetAlert({ success: null });
  }, [detailIsOpen, formIsOpen]);

  const openDetail = (modelType: ModelType, id: string) => {
    setDetailIsOpen(true);
    setDetailModelType(modelType);
    setDetailId(id);
  };

  const closeDetail = () => {
    setDetailIsOpen(false);
    setDetailModelType(null);
  };

  const openForm = (modelType: ModelType, id?: string) => {
    setFormIsOpen(true);
    setFormModelType(modelType);
    setFormId(id ? id : null);
  };

  const closeForm = () => {
    setFormIsOpen(false);
    setFormModelType(null);
  };

  const openCalDetail = ({ title, data }: OpenDetailProps) => {
    setCalDetailIsOpen(true);
    setTitle(title);
    setCalendarDetailData(data);
  };

  const closeCalDetail = () => {
    setCalDetailIsOpen(false);
    setTitle(undefined);
  };

  const value = {
    detail: {
      modelType: detailModelType,
      isOpen: detailIsOpen,
      id: detailId,
      open: openDetail,
      close: closeDetail,
    },
    form: {
      modelType: formModelType,
      isOpen: formIsOpen,
      id: formId,
      open: openForm,
      close: closeForm,
    },
    calendarData: {
      title: title,
      data: calendarDetailData,
      isOpen: calendarDataIsOpen,
      open: openCalDetail,
      close: closeCalDetail,
    },
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export { ModalProvider, useModal };
