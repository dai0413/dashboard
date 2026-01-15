import { createContext, ReactNode, useContext, useState } from "react";
import { ModelType } from "../types/models";

type ModalState = {
  detail: {
    modelType: ModelType | null;
    isOpen: boolean;
    id: string | null;
    open: (modelType: ModelType, id: string) => void;
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
    null
  );
  const [detailId, setDetailId] = useState<string | null>(null);

  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);
  const [formModelType, setFormModelType] = useState<ModelType | null>(null);
  const [formId, setFormId] = useState<string | null>(null);

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
