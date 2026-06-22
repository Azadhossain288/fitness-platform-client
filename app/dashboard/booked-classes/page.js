"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BookedClassesPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
   
    axios.get("http://localhost:5000/bookings", { withCredentials: true })
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Booked Classes</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#1e2736]">
            <th className="p-3">Class Name</th>
            <th className="p-3">Trainer</th>
            <th className="p-3">Schedule</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((item) => (
            <tr key={item._id} className="border-b border-[#1e2736]">
              <td className="p-3">{item.className}</td>
              <td className="p-3">{item.trainerName}</td>
              <td className="p-3">{item.schedule}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}