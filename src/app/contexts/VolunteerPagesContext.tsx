import { createContext, useContext } from "react";

type VolunteerContextType = {
  fetchActiveShifts: (options?: {
    showSuccessFeedback: boolean;
  }) => Promise<void>;
};

const VolunteerContext = createContext<VolunteerContextType | null>(null);

export function useVolunteerContext() {
  const context = useContext(VolunteerContext);
  if (!context) {
    throw new Error(
      "useVolunteerContext must be used within a <VolunteerContext.Provider>"
    );
  }
  return context;
}

export default VolunteerContext;
