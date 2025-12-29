"use client";
import { useState, useEffect } from "react";
import { Event } from "@/services/eventService";
import Image from "next/image";

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data.events || []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (event: Event) => {
    console.log("Delete clicked for:", event);

    if (!confirm(`Delete "${event.title}"?`)) return;

    try {
      const identifier = event.slug || event._id;
      const deleteUrl = `/api/events/${identifier}/delete`;

      console.log("Delete URL:", deleteUrl);
      console.log("Using identifier:", identifier);

      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Delete successful:", result);

        alert(result.message || "Event deleted successfully");

        setEvents((prev) => prev.filter((e) => e._id !== event._id));
      } else if (response.status === 404) {
        alert("Event not found. It may have been already deleted.");
      } else if (response.status === 405) {
        alert("DELETE method not allowed. Check server configuration.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(
          `Error ${response.status}: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(events);
  return (
    <section className="flex flex-col gap-10">
      <div className="flex align-center justify-between">
        <h1>Event Management</h1>
        <a href="/create-event" className="button inline-flex">
          Add New Event
        </a>
      </div>
      <div className="table-wrapper">
        <table className="w-full">
          <thead>
            <tr>
              <th>Events</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Booked spot</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>
                  <a
                    href={`https://${process.env.VERCEL_URL}/events/${event.slug}`}
                    className="flex gap-3"
                  >
                    <Image
                      src={event.image}
                      alt="photo"
                      width={40}
                      height={40}
                    />
                    {event.title}
                  </a>
                </td>
                <td>
                  <div>{event.location}</div>
                </td>
                <td>
                  <div>{event.date}</div>
                </td>
                <td>
                  <div>{event.time}</div>
                </td>
                <td>
                  <div>{event.spot}</div>
                </td>
                <td>
                  <div className="flex gap-3">
                    {/* <button>Edit</button> */}
                    <button onClick={() => handleDelete(event)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Events;
