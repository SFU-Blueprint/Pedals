"use client";

import {useEffect, useRef, useState} from "react";
import DateSelector from "@/components/DateSelector";
import {Tables} from "@/lib/supabase.types";
import {formatDate} from "../utils";

interface EditPeopleGridProps {
    people: Tables<"users">[];
    refreshPeople: () => Promise<void>;
    filter: {
        name: string;
    };
}

interface EditPeopleCardProps {
    person: Tables<"users">;
    refreshPeople: () => Promise<void>;
}

function EditPeopleCard({ person, refreshPeople }: EditPeopleCardProps) {
    const [dob, setDob] = useState<Date | null>(() => {
        const formattedDob = formatDate(person.dob);
        return formattedDob ? new Date(formattedDob) : null;
    });
    const [lastSeen, setLastSeen] = useState<Date | null>(() => {
        const formattedLastSeen = formatDate(person.last_seen);
        return formattedLastSeen ? new Date(formattedLastSeen) : null;
    });

    const [isEditing, setIsEditing] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsEditing(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`edit-card flex w-full justify-between border-y-[1px] border-y-pedals-darkgrey px-20 py-4 ${isEditing ? "bg-pedals-lightgrey" : "bg-pedals-stroke"}`}
        >
            <div className="flex items-center justify-start">
                <h3 className="w-72">{person.name ?? "Error"}</h3>
                <h2 className="w-80">{person.username ?? "Error"}</h2>
                <div className="flex items-center justify-between gap-3">
                    {isEditing ? (
                        <DateSelector
                            className="w-72"
                            selected={dob}
                            onChange={(d) => setDob(d)}
                        />
                    ) : (
                        <p className="w-72">
                            {dob?.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }) ?? "Error"}
                        </p>
                    )}
                    {isEditing ? (
                        <DateSelector
                            className="w-72"
                            selected={lastSeen ? new Date(lastSeen) : null}
                            onChange={(d) => setLastSeen(d)}
                        />
                    ) : (
                        <p className="w-72">
                            {lastSeen?.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }) ?? "Error"}
                        </p>
                    )}
                </div>
            </div>
            <button
                type="button"
                className="!rounded-[30px] !px-12 uppercase"
                onClick={() => {
                    setIsEditing(!isEditing);
                }}
            >
                {isEditing ? "Done" : "Edit"}
            </button>
        </div>
    );
}

export default function EditPeopleGrid({ people, refreshPeople, filter, }: EditPeopleGridProps) {
    return (
        <div className="flex h-full flex-col overflow-y-auto bg-pedals-grey">
            <div className="sticky flex items-center justify-start px-20 py-2">
                <p className="w-72">Name</p>
                <p className="w-52">Username</p>
                <div className="flex justify-between gap-3">
                    <p className="flex w-72 justify-center">Date of Birth</p>
                    <p className="flex w-72 justify-center">Last Seen</p>
                </div>
                <p className="ml-40">Total</p>
            </div>
            <div className="overflow-y-scroll">
            {people
                ?.filter((person) => filter.name
                            ? person.name?.toLowerCase().includes(filter.name.toLowerCase())
                            : true)
                    ?.map((person) => (
                        <EditPeopleCard
                            key={person.id}
                            person={person}
                            refreshPeople={refreshPeople}
                        />
                    ))}
            </div>
        </div>
    );
}
