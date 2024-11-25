"use client";

import { useCallback, useEffect, useState } from "react";
import EditPeopleGrid from "../components/EditPeopleGrid";
import DeleteConfirmation from "../components/DeleteConfirmation";
import FormInput from "@/components/FormInput";
import RadioButton from "@/components/RadioButton";
import { Tables } from "@/lib/supabase.types";
import useFeedbackFetch from "@/hooks/FeedbackFetch";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import { isInactive, isUnder18 } from "@/utils/DateTime";
import { setsEqual } from "@/utils/Validators";

export default function ManagePeoplePage() {
  const [people, setPeople] = useState<Tables<"users">[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchInactive, setSearchInactive] = useState(false);
  const [searchUnder18, setSearchUnder18] = useState(false);
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

    

    const removalCheck = async (ids: Set<string>, options: { callbackOnWarning: boolean, showSuccessFeedback: boolean } = { callbackOnWarning: true, showSuccessFeedback:false }) =>
      feedbackFetch(
        "/api/people",
        {
          method: "POST",
          body: JSON.stringify({ ids: Array.from(ids), flag: "delete_users" }),
          headers: {
            "Content-Type": "application/json"
          }
          
        },
        {
          callback: async (input) => {
            if (input.length === 0){
              await executeRemovePeople(input);
            }
            else{
              setPopup({
                title: "Error in users' shifts",
                component: (
                  <div className="flex h-full flex-col items-center justify-between gap-10 px-10 py-10">
                    <div>
                    The following user(s) have active shifts that have not been checked out.
                      {
                        input[0].map((user: any, key: number) => (
                          <p>{user.name}</p>
                        ))
                      }
                    </div>
                    <div>
                      The following user(s) have error shifts that has to be resolved first.
                      {
                        input[1].map((user: any, key: number) => (
                          <p>{user.name}</p>
                        ))
                      }
                    </div>
                    <button
                      className="!w-fit !px-10 uppercase"
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        setPopup(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )
              })
            }
          },
          callbackOnWarning: options.callbackOnWarning,
          showSuccessFeedback: options.showSuccessFeedback
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
        (searchUnder18 ? isUnder18(person.dob) : true) &&
        (searchInactive ? isInactive(person.last_seen) : true)
    )
    ?.sort(
      (a, b) =>
        new Date(a.last_seen).getTime() - new Date(b.last_seen).getTime()
    );
  const filteredIDs = new Set(filteredPeople.map((p) => p.id));

  return (
    <>
      <div className="z-10 flex w-full flex-col bg-pedals-lightgrey">
        <FormInput
          className="mb-6 ml-auto mr-20 mt-36 flex w-80"
          type="text"
          placeholder="SEARCH NAME"
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
              label="Under 18"
              onChange={() => setSearchUnder18(!searchUnder18)}
            />
          </div>
          <button
            aria-disabled={selectedIDs.size === 0 || loading}
            type="submit"
            className="rounded-full bg-yellow-400 uppercase"
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
                    onConfirm={async () => {
                      setPopup(null)
                      removalCheck(selectedIDs);
                    }
                    }
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
