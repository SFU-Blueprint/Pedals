"use client";

import { useState } from "react";
import Feedback, { FeedbackType } from "@/components/Feedback";
import NavBar from "@/components/NavBar";
import Dropdown from "@/components/Dropdown";

export default function ExportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<[FeedbackType, string] | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const exportOptions = ["hours", "people", "shift type"];
  const yearoptions = ["2024"];

  async function downloadCsv() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/export", {
        method: "GET"
      });

      if (response.status === 200) {
        const data = await response.text();
        const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "volunteers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const errorData = await response.json();
        if (response.status >= 400 && response.status < 500) {
          setFeedback([FeedbackType.Warning, errorData.message]);
        } else if (response.status >= 500 && response.status < 600) {
          setFeedback([FeedbackType.Error, errorData.message]);
        }
      }
    } catch (error) {
      console.error("Error downloading CSV:", error);
      setFeedback([FeedbackType.Error, "An error occurred while downloading the CSV. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  }

  // Helper function to display a message based on selectedOptions
  function renderExportMessage() {
    switch (selectedOptions) {
      case "hours":
        return (
          <div>
            <p className="my-4">
              Export yearly hours by volunteer in CSV format
            </p>
            <p className="my-2">Select year</p>

            <div className="">
              <Dropdown
                className="w-48"
                options={yearoptions}
                currentOption={
                  selectedYear && yearoptions.includes(selectedYear)
                    ? selectedYear
                    : null
                }
                onClick={(e) => {
                  setSelectedYear(
                    (e.target as HTMLButtonElement).value || null
                  );
                  e.preventDefault();
                }}
              />
            </div>
          </div>
        );
      case "people":
        return <div>Export volunteer list in CSV format</div>;
      case "shift type":
        return <div>Export data by shift type in CSV format</div>;
      default:
        return <div>Select an option to see export details</div>;
    }
  }

  return (
    <section className="flex h-screen w-screen flex-col bg-pedals-lightgrey">
      <NavBar
        className="fixed left-20 top-20 z-30"
        links={[
          { href: "/change-access-code", label: "Change Access Code" },
          { href: "/export", label: "Export" }
        ]}
      />
      <div className="fixed left-20 top-48 z-30">
        <h3 className="m-3">Export Logbook Data </h3>
        {exportOptions.map((label) => (
          <button
            key={label}
            type="button"
            className={`mx-2 p-3 uppercase ${selectedOptions === label && "!bg-pedals-yellow"}`}
            onClick={() =>
              setSelectedOptions(selectedOptions === label ? null : label)
            }
          >
            {label}
          </button>
        ))}
        <div className="relative top-20 m-3 flex text-xl">
          {renderExportMessage()}
        </div>
        <div className="relative top-40 m-3 flex text-xl">
          <button
            className={`${!isLoading ? "bg-pedals-yellow" : ""} rounded-xl px-4 py-2 uppercase`}
            onClick={downloadCsv}
            aria-disabled={isLoading}
            type="reset"
          >
            {isLoading ? "Downloading..." : "Export"}
          </button>
          {feedback && <Feedback type={feedback[0]}>{feedback[1]}</Feedback>}
        </div>
      </div>
    </section>
  );
}
