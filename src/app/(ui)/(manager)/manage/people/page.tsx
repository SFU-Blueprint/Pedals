"use client";

import {useCallback, useEffect, useState} from "react";
import FormInput from "@/components/FormInput";
import RadioButton from "@/components/RadioButton";
import EditPeopleGrid from "@/(ui)/(manager)/manage/people/component/EditPeopleGrid";
import {Tables} from "@/lib/supabase.types";

export default function ManagePeoplePage() {
  const [searchName, setSearchName] = useState("");
  const [searchInactive, setSearchInactive] = useState(false);
  const [searchUnder18, setSearchUnder18] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const [people, setPeople] = useState<Tables<"users">[]>([]);

  const fetchPeople = useCallback(async () => {
    try {
      const response = await fetch("/api/people", {
        method: "GET"
      });
      if (response.status === 200) {
        setPeople((await response.json()) as Tables<"users">[]);
        // This will be handoff to Terry for feedback popup
      } else {
        // This will be handoff to Terry for feedback popup
      }
    } catch (error) {
      // This will be handoff to Terry for feedback popup
    }
  }, []);

    useEffect(() => {
        fetchPeople()
    }, [fetchPeople]);

  return (
    <>
      <FormInput
        className="ml-auto flex w-96 pr-20 pt-36"
        type="text"
        placeholder="Search Name"
        onChange={(e) => setSearchName(e.target.value)}
      />
      <div className="flex w-full flex-col bg-pedals-lightgrey pt-6">
        <div className="flex w-full items-center px-10">
          <hr
            className="flex-grow bg-gray-300"
            style={{ height: "3px", margin: "0 40px" }}
          />
        </div>
        <div className="flex w-full justify-between px-20 py-2">
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
          >
            Remove from database
          </button>
        </div>
      </div>
      <EditPeopleGrid
          people={people}
          refreshPeople={fetchPeople}
          filter={{
              name: searchName
          }
      }/>
    </>
  );
}
