"use client";

import { useState } from "react";

export default function CreateEventForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Собираем данные формы
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);

      // Получаем файл изображения
      const imageInput = form.querySelector("#image") as HTMLInputElement;
      if (imageInput?.files?.[0]) {
        formData.append("image", imageInput.files[0]);
      }

      // Добавляем overview (если есть поле)
      const overviewInput = form.querySelector(
        "#overview"
      ) as HTMLTextAreaElement;
      if (overviewInput?.value) {
        formData.append("overview", overviewInput.value);
      }

      // Просто отправляем запрос - вся валидация на сервере
      const response = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Ответ сервера:", result);

      if (response.ok) {
        setMessage(`✅ Успех: ${result.message}`);
        (e.target as HTMLFormElement).reset();
        await fetch("/api/revalidate?tag=events", {
          method: "POST",
        });
      } else {
        setMessage(`❌ Ошибка: ${result.message}`);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setMessage("❌ Ошибка сети");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section
      className="flex-col gap-15 justify-center items-center"
      id="book-event"
    >
      <h1 className="text-center">Create an Event</h1>

      {message && (
        <div
          className={`p-3 mb-4 rounded ${
            message.includes("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      <form className="create-event" onSubmit={handleSubmit}>
        {/* Event Title */}
        <div>
          <label htmlFor="title">Event Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter event title"
          />
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="date">Event Date</label>
          <input
            id="date"
            name="date"
            type="date"
            placeholder="Select event date"
          />
        </div>

        {/* Event time */}
        <div>
          <label htmlFor="time">Event time</label>
          <input
            id="time"
            name="time"
            type="time"
            placeholder="Select start time"
          />
        </div>

        {/* Event Location */}
        <div>
          <label htmlFor="location">Event Location</label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="Enter venue or online link"
          />
        </div>

        {/* Event Type */}
        <div>
          <label htmlFor="mode">Event Type</label>
          <input
            id="mode"
            name="mode"
            type="text"
            placeholder="Select event type"
          />
        </div>

        {/* Event Image / Banner */}
        <div>
          <label htmlFor="image">Event Image / Banner</label>
          <input id="image" name="image" type="file" accept="image/*" />
        </div>

        <div>
          <label htmlFor="overview">Organizer</label>
          <input
            id="organizer"
            name="organizer"
            placeholder="Enter event organizer"
          />
        </div>

        <div>
          <label htmlFor="agenda">Agenda</label>
          <input id="agenda" name="agenda" placeholder="Enter event Agenda" />
        </div>

        <div>
          <label htmlFor="audience">Audience</label>
          <input
            id="audience"
            name="audience"
            placeholder="Enter event audience"
          />
        </div>

        <div>
          <label htmlFor="venue">Venue</label>
          <input id="venue" name="venue" placeholder="Enter event venue" />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="Add tags such as react, next, js"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter event description"
            rows={8}
            style={{ minHeight: "210px" }}
          />
        </div>

        {/* Overview (опционально) */}
        <div>
          <label htmlFor="overview">Overview</label>
          <textarea
            id="overview"
            name="overview"
            placeholder="Enter event overview"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={isLoading ? "opacity-50" : ""}
        >
          {isLoading ? "Sending..." : "Save Event"}
        </button>
      </form>
    </section>
  );
}
