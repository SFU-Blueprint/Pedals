"use client";

import { useState } from "react";
import Feedback, { FeedbackType } from "@/components/Feedback";

export default function ExportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<[FeedbackType, string] | null>(null);

  async function downloadCsv() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/export", {
        method: "GET"
      });

      const data = await response.json();

      if (response.status === 200) {
        const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "volunteers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (response.status >= 400 && response.status < 500) {
        setFeedback([FeedbackType.Warning, data.message]);
      } else if (response.status >= 500 && response.status < 600) {
        setFeedback([FeedbackType.Error, data.message]);
      }
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <button onClick={downloadCsv} aria-disabled={isLoading}>
        {isLoading ? "Downloading..." : "Download CSV"}
      </button>
      {feedback && <Feedback type={feedback[0]}>{feedback[1]}</Feedback>}
    </div>
  );
}
