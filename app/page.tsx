import ExploreBtn from "./components/ExploreBtn";
import EventCard from "./components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const dynamic = "force-dynamic"; // Добавьте это

async function Home() {
  // УБЕРИТЕ ЭТИ ДВЕ СТРОКИ:
  // "use cache";
  // cacheLife("hours");

  try {
    // Используйте проверку на undefined
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/events`, {
      cache: "no-store", // или 'force-cache'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const { events } = await response.json();

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
  } catch (error) {
    console.error("Error:", error);
    // Возвращаем компонент с пустыми данными
    return (
      <section>
        <h1 className="text-center mb-5">
          The Hub for Every Dev <br /> Event You Can't Miss
        </h1>
        <p className="text-center">
          Hackathons, Meetups, and Conferences, All in One Place
        </p>
        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>
          <p>Events temporarily unavailable</p>
        </div>
      </section>
    );
  }
}

export default Home;
