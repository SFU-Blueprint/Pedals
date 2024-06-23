import React, { useEffect, useState } from "react";
import getAll from "@/lib/getall";

interface Volunteer {
  name: string;
  hours: number;
}

function AdminPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      const data = await getAll();
      if (data) {
        setVolunteers(data);
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Volunteer Hours</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((volunteer) => (
            <tr>
              <td>{volunteer.name}</td>
              <td>{volunteer.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
