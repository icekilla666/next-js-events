import * as React from "react";
import ExploreBtn from "./components/ExploreBtn";
import EventCard from "./components/EventCard";
import { events } from "@/lib/constants";

function Home() {
  console.log("Server");
  return (
    <section>
      <h1 className="text-center mb-5">
        The Hub for Every Dev <br></br> Event You Can’t Miss
      </h1>
      <p className="text-center">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Home;
