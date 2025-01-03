import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { FeedbackInterface } from "@/components/Feedback";
import { PopupInterface } from "@/components/Popup";

type UIComponentsContextType = {
  setFeedback: Dispatch<SetStateAction<FeedbackInterface | null>>;
  setPopup: Dispatch<SetStateAction<PopupInterface | null>>;
  loading: boolean;
  popup: boolean;
};

const UIComponentsContext = createContext<UIComponentsContextType | null>(null);

export function useUIComponentsContext() {
  const context = useContext(UIComponentsContext);
  if (!context) {
    throw new Error(
      "useUIComponentsContext must be used within a <UIComponentsContext.Provider>"
    );
  }
  return context;
}

export default UIComponentsContext;
