"use client";

import { useCallback, useEffect, useState } from "react";
import EditPeopleGrid from "../components/EditPeopleGrid";
import DeleteConfirmation from "../components/DeleteConfirmation";
import FormInput from "@/components/FormInput";
import RadioButton from "@/components/RadioButton";
import { Tables } from "@/lib/supabase.types";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import { isInactive, isUnder24 } from "@/utils/DateTime";
import { setsEqual } from "@/utils/Validators";

export default function ManagePeoplePage() {
  const [people, setPeople] = useState<Tables<"users">[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchInactive, setSearchInactive] = useState(false);
  const [searchUnder24, setSearchUnder24] = useState(false);
  const [selectedIDs, setSelectedIDs] = useState<Set<string>>(new Set());
  const feedbackFetch = useFeedbackFetch();
  const { setPopup, loading } = useUIComponentsContext();

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

  const executeRemovePeople = async (ids: Set<string>) =>
    feedbackFetch(
      "/api/people",
      {
        method: "DELETE",
        body: JSON.stringify({ ids: Array.from(ids) }),
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

  const filteredPeople = people
    ?.filter(
      (person) =>
        (searchName
          ? person.name?.toLowerCase().includes(searchName.toLowerCase())
          : true) &&
        (searchUnder24 ? isUnder24(person.dob) : true) &&
        (searchInactive ? isInactive(person.last_seen) : true)
    )
    ?.sort((a, b) => {
      const lastSeenComparison =
        new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime();
      if (lastSeenComparison !== 0) return lastSeenComparison;
      const nameComparison = a.name.localeCompare(b.name);
      if (nameComparison !== 0) return nameComparison;
      if (a.dob && b.dob) {
        return new Date(a.dob).getTime() - new Date(b.dob).getTime();
      }
      return 0;
    });
  const filteredIDs = new Set(filteredPeople.map((p) => p.id));

  return (
    <>
      <div className="z-10 flex w-full flex-col">
        <FormInput
          uppercase
          className="mb-6 ml-auto mr-20 mt-36 flex w-80 uppercase"
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
              checked={setsEqual(selectedIDs, filteredIDs)}
              label="Select All"
              onChange={() => {
                setSelectedIDs(
                  setsEqual(selectedIDs, filteredIDs) ? new Set() : filteredIDs
                );
              }}
            />
            <RadioButton
              label="Inactive"
              onChange={() => setSearchInactive(!searchInactive)}
            />
            <RadioButton
              label="Under 24"
              onChange={() => setSearchUnder24(!searchUnder24)}
            />
          </div>
          <button
            aria-disabled={selectedIDs.size === 0 || loading}
            type="submit"
            className="rounded-full bg-yellow-400"
            onClick={(e) => {
              e.preventDefault();
              if (loading || selectedIDs.size === 0) return;
              setPopup({
                title: `Remove ${selectedIDs.size} people from the database?`,
                component: (
                  <DeleteConfirmation
                    data={filteredPeople
                      .filter((person) => selectedIDs.has(person.id))
                      .map((person) => ({
                        id: person.id,
                        name: person.name,
                        lastSeen: person.last_seen
                      }))}
                    onCancel={() => setPopup(null)}
                    onConfirm={async () => executeRemovePeople(selectedIDs)}
                  />
                )
              });
            }}
          >
            Remove from database
          </button>
        </div>
      </div>
      {filteredPeople.length === 0 &&
      (searchName || searchInactive || searchUnder24) ? (
        <h3 className="flex w-full justify-center">No Results Found</h3>
      ) : (
        <EditPeopleGrid
          people={filteredPeople}
          refreshPeople={() => fetchPeople({ showSuccessFeedback: false })}
          selectedIDs={selectedIDs}
          setSelectedIDs={setSelectedIDs}
        />
      )}
    </>
  );
}
