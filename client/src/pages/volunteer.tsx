// src/pages/volunteer.tsx
import { useState } from "react";
import login from "@/lib/login";
import checkout from "@/lib/checkout";
import checkin from "@/lib/checkin";

function VolunteerPage() {
  const [tempName, setTempName] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [isCheckedIn, setCheckedIn] = useState<boolean | null>(null);

  const handleLogin = (name: string) => {
    (async () => {
      const volunteer = await login(name);
      setCurrentName(volunteer.name);
      setCheckedIn(volunteer.in_time != null);
    })();
  };

  const handleCheckin = async () => {
    (async () => {
      await checkin(currentName);
      setCheckedIn(true);
    })();
  };

  const handleCheckout = async () => {
    (async () => {
      await checkout(currentName);
      setCheckedIn(false);
    })();
  };

  return (
    <div>
      <h1>Volunteer Page</h1>
      <input
        type="text"
        value={tempName}
        onChange={(e) => setTempName(e.target.value)}
        placeholder="Enter your name"
      />
      <button type="submit" onClick={() => handleLogin(tempName)}>
        Log In
      </button>
      {isCheckedIn != null && (
        <div>
          <p>
            {tempName} is currently {isCheckedIn ? "checked in" : "checked out"}
          </p>
          {isCheckedIn ? (
            <button type="button" onClick={handleCheckout}>
              Check Out
            </button>
          ) : (
            <button type="button" onClick={handleCheckin}>
              Check In
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default VolunteerPage;
