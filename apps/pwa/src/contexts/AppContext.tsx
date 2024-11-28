import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { getSerwist } from "virtual:serwist";

interface AppContext {}

const defaultContextValue: AppContext = {};

const AppContext = createContext<AppContext>(defaultContextValue);

export function AppContextProvider({ children }: PropsWithChildren) {
  const contextValue = {};

  async function init() {
    if ("serviceWorker" in navigator) {
      const serwist = await getSerwist();
      serwist?.addEventListener("installed", () => {
        alert("Serwist installed!");
      });
      void serwist?.register();
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
