import { createContext, useContext } from "react";

type OptionsState = {};

const OptionContext = createContext<OptionsState>({});

const OptionProvider = ({ children }: { children: React.ReactNode }) => {
  return <OptionContext.Provider value={{}}>{children}</OptionContext.Provider>;
};

const useOptions = () => {
  const context = useContext(OptionContext);
  if (!context) {
    throw new Error("useOptions must be used within a PlayerProvider");
  }
  return context;
};

export { useOptions, OptionProvider };
