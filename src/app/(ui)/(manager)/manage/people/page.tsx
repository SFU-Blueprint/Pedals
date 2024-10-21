"use client";

import { useCallback, useEffect, useState, MouseEvent } from "react";
import FormInput from "@/components/FormInput";
import RadioButton from "@/components/RadioButton";
import EditPeopleGrid from "./components/EditPeopleGrid";
import { Tables } from "@/lib/supabase.types";
import useFeedbackFetch from "@/hooks/FeedbackFetch";

export default function ManagePeoplePage() {
  const [searchName, setSearchName] = useState("");
  const [searchInactive, setSearchInactive] = useState(false);
  const [searchUnder18, setSearchUnder18] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);
  const [people, setPeople] = useState<Tables<"users">[]>([]);
  const [selectedIDs, setSelectedIDs] = useState<string[]>([]);
  const feedbackFetch = useFeedbackFetch();

  const fetchPeople = useCallback(
    async (
      options: { showSuccessFeedback: boolean } = { showSuccessFeedback: true }
    ) => {
      await feedbackFetch(
        "/api/people",
        {
          method: "GET"
        },
        {
          callback: (data) => setPeople(data as Tables<"users">[]),
          showSuccessFeedback: options.showSuccessFeedback
        }
      );
    },
    [feedbackFetch]
  );

  const handleRemovePeople = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await feedbackFetch(
      "/api/people",
      {
        method: "DELETE",
        body: JSON.stringify({ ids: selectedIDs }),
        headers: {
          "Content-Type": "application/json"
        }
      },
      {
        callback: async () => fetchPeople({ showSuccessFeedback: false })
      }
    );
  };

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  return (
    <>
      <div className="z-10 flex w-full flex-col bg-pedals-lightgrey">
        <FormInput
          className="mb-6 ml-auto mr-20 mt-36 flex w-80"
          type="text"
          placeholder="Search Name"
          onChange={(e) => setSearchName(e.target.value)}
        />
        <hr
          className="bg-pedals-grey"
          style={{ height: "2px", margin: "0 80px" }}
        />
        <div className="flex w-full justify-between px-20 py-6">
          <div className="flex items-center gap-6">
            <RadioButton
              label="Select All"
              onClick={() => setSelectedAll(!selectedAll)}
            />
            <RadioButton
              label="Inactive"
              onClick={() => setSearchInactive(!searchInactive)}
            />
            <RadioButton
              label="Under 18"
              onClick={() => setSearchUnder18(!searchUnder18)}
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-yellow-400 uppercase"
            onClick={handleRemovePeople}
          >
            Remove from database
          </button>
        </div>
      </div>
      <EditPeopleGrid
        people={people}
        refreshPeople={() => fetchPeople({ showSuccessFeedback: false })}
        filter={{
          name: searchName,
          inactive: searchInactive,
          under18: searchUnder18
        }}
        selectedIDs={selectedIDs}
        setSelectedIDs={setSelectedIDs}
      />
    </>
  );
}
