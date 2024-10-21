"use client";

import { useMemo, useState } from "react";
import UIComponentsContext from "@/contexts/UIComponentsContext";
import Feedback, { FeedbackInterface } from "@/components/Feedback";
import NavBar from "@/components/NavBar";
import Popup, { PopupInterface } from "@/components/Popup";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [feedback, setFeedback] = useState<FeedbackInterface | null>(null);
  const [popup, setPopup] = useState<PopupInterface | null>(null);

  return (
    <UIComponentsContext.Provider
      value={useMemo(() => ({ setFeedback, setPopup }), [])}
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
        <Feedback className="fixed bottom-10 right-1/2" type={feedback.type}>
          {feedback.message}
        </Feedback>
      )}
      {popup && (
        <Popup title={popup.title} closeAction={() => setPopup(null)}>
          {popup.component}
        </Popup>
      )}
    </UIComponentsContext.Provider>
  );
}
