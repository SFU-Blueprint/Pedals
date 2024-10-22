"use client";

import { useCallback, useEffect, useState } from "react";
import FormInput from "@/components/FormInput";
import RadioButton from "@/components/RadioButton";
import EditPeopleGrid from "../components/EditPeopleGrid";
import { Tables } from "@/lib/supabase.types";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import { arraysEqual, isInactive, isUnder18 } from "@/utils";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import DeleteConfirmation from "../components/DeleteConfirmation";

export default function ManagePeoplePage() {
  const [people, setPeople] = useState<Tables<"users">[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchInactive, setSearchInactive] = useState(false);
  const [searchUnder18, setSearchUnder18] = useState(false);
  const [selectedIDs, setSelectedIDs] = useState<string[]>([]);
  const feedbackFetch = useFeedbackFetch();
  const { setPopup } = useUIComponentsContext();

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

  const handleRemovePeople = async () =>
    feedbackFetch(
      "/api/people",
      {
        method: "DELETE",
        body: JSON.stringify({ ids: selectedIDs }),
        headers: {
          "Content-Type": "application/json"
        }
      },
      {
        callback: async () => {
          await fetchPeople({ showSuccessFeedback: false });
          setPopup(null);
        }
      }
    );

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const filteredPeople = people?.filter(
    (person) =>
      (searchName
        ? person.name?.toLowerCase().includes(searchName.toLowerCase())
        : true) &&
      (searchUnder18 ? isUnder18(person.dob) : true) &&
      (searchInactive ? isInactive(person.last_seen) : true)
  );
  const filteredIDs = filteredPeople.map((p) => p.id);

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
              checked={arraysEqual(selectedIDs, filteredIDs)}
              label="Select All"
              onClick={() => {
                setSelectedIDs(
                  arraysEqual(selectedIDs, filteredIDs) ? [] : filteredIDs
                );
              }}
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
            disabled={selectedIDs.length === 0}
            type="submit"
            className="rounded-full bg-yellow-400 uppercase"
            onClick={(e) => {
              e.preventDefault();
              setPopup({
                title: `Remove ${selectedIDs.length} people from the database?`,
                component: (
                  <DeleteConfirmation
                    data={filteredPeople
                      .filter((person) => selectedIDs.includes(person.id))
                      .map((person) => ({
                        id: person.id,
                        name: person.name,
                        lastSeen: person.last_seen
                      }))}
                    onCancel={() => setPopup(null)}
                    onConfirm={async () => handleRemovePeople()}
                  />
                )
              });
            }}
          >
            Remove from database
          </button>
        </div>
      </div>
      <EditPeopleGrid
        people={filteredPeople}
        refreshPeople={() => fetchPeople({ showSuccessFeedback: false })}
        selectedIDs={selectedIDs}
        setSelectedIDs={setSelectedIDs}
      />
    </>
  );
}
