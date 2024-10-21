import { ReactNode, useCallback } from "react";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import { FeedbackType } from "@/components/Feedback";

export default function useFeedbackFetch() {
  const { setFeedback, setPopup } = useUIComponentsContext();
  return useCallback(
    async (
      url: string,
      params: RequestInit,
      options: {
        callback?: (data?: any) => void;
        showSuccessFeedback?: boolean;
        warningPopup?: ReactNode;
      } = { showSuccessFeedback: true }
    ) => {
      const { callback, showSuccessFeedback = true, warningPopup } = options;
      setFeedback({ type: FeedbackType.Loading, message: "Loading" });
      try {
        const response = await fetch(url, params);
        const result = await response.json();
        const { data, message } = result;
        if (response.ok) {
          if (callback) {
            callback(data);
          }
          if (response.status !== 200 && warningPopup) {
            setPopup({ title: "Warning", component: warningPopup });
          }
          if (showSuccessFeedback) {
            setFeedback({ type: FeedbackType.Success, message });
          }
        } else if (response.status >= 400 && response.status < 500) {
          setFeedback({ type: FeedbackType.Warning, message });
        } else if (response.status >= 500 && response.status < 600) {
          setFeedback({ type: FeedbackType.Error, message });
        }
      } catch (error) {
        setFeedback({ type: FeedbackType.Error, message: "Unknown Error" });
      }
      setTimeout(() => setFeedback(null), 2500);
    },
    [setFeedback, setPopup]
  );
}
