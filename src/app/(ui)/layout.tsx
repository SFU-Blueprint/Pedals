"use client";

import { useEffect, useMemo, useState } from "react";
import UIComponentsContext from "@/contexts/UIComponentsContext";
import Feedback, {
  FeedbackInterface,
  FeedbackType
} from "@/components/Feedback";
import NavBar from "@/components/NavBar";
import Popup, { PopupInterface } from "@/components/Popup";

export default function UILayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [feedback, setFeedback] = useState<FeedbackInterface | null>(null);
  const [popup, setPopup] = useState<PopupInterface | null>(null);

  useEffect(() => {
    if (feedback !== null && feedback.type !== FeedbackType.Loading) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [feedback]);

  return (
    <UIComponentsContext.Provider
      value={useMemo(
        () => ({
          setFeedback,
          setPopup,
          loading: feedback !== null && feedback.type === FeedbackType.Loading,
          popup: popup !== null
        }),
        [feedback, popup]
      )}
    >
      <NavBar
        className="fixed right-20 top-20 z-30"
        links={[
          { href: "/checkin", label: "CHECK IN" },
          { href: "/register", label: "REGISTER" },
          { href: "/manage-login", label: "MANAGE", highlight: "/manage" }
        ]}
      />
      {children}
      {feedback && (
        <Feedback
          className="fixed bottom-10 right-1/2 z-30 translate-x-1/2"
          type={feedback.type}
        >
          {feedback.message}
        </Feedback>
      )}
      {popup && (
        <Popup
          className="fixed left-0 top-0 z-30"
          title={popup.title}
          closeAction={() => setPopup(null)}
        >
          {popup.component}
        </Popup>
      )}
    </UIComponentsContext.Provider>
  );
}
