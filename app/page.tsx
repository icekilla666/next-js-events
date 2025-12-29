import ExploreBtn from "./components/ExploreBtn";
import EventCard from "./components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function Home() {
  "use cache";
  cacheLife("hours");
  const responce = await fetch(`https://${process.env.VERCEL_URL}/api/events`);
  const { events } = await responce.json();

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
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
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
