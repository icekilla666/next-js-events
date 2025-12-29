'use client';

import ExploreBtn from "./components/ExploreBtn";
import EventCard from "./components/EventCard";
import { IEvent } from "@/database";
import { Suspense } from 'react';

function getApiUrl() {
  if (typeof window !== 'undefined') {
    return '/api/events';
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/events`;
  }
  
  return 'http://localhost:3000/api/events';
}

async function EventsList() {
  const apiUrl = getApiUrl();
  const response = await fetch(apiUrl, {
    cache: 'no-store' // или 'force-cache' если нужен кэш
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`);
  }
  
  const { events } = await response.json();

  return (
    <ul className="events">
      {events && events.length > 0 ? (
        events.map((event: IEvent) => (
          <li key={event.title}>
            <EventCard {...event} />
          </li>
        ))
      ) : (
        <p>No events found</p>
      )}
    </ul>
  );
}

// Fallback компонент для загрузки
function EventsLoading() {
  return (
    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>
      <div className="flex justify-center items-center h-40">
        <p>Loading events...</p>
      </div>
    </div>
  );
}

// Основной компонент
export default function Home() {
  return (
    <section>
      <h1 className="text-center mb-5">
        The Hub for Every Dev <br></br> Event You Can't Miss
      </h1>
      <p className="text-center">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />

      <Suspense fallback={<EventsLoading />}>
        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>
          <EventsList />
        </div>
      </Suspense>
    </section>
  );
}