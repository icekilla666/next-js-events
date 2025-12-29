export interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  time?: string;
  description?: string;
  overview?: string;
  image: string;
  slug: string;
  bookedSpots?: number;
  createdAt?: string;
  updatedAt?: string;
  spot: number;
}

export async function deleteEvent(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/events/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const response = await fetch(`/api/events/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    const data = await response.json();
    return data.event || null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}
