/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

// POST ЗАПРОС
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const requiredFields = [
      "title",
      "date",
      "location",
      "description",
      "overview",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData.get(field)
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          missing: missingFields,
        },
        { status: 400 }
      );
    }

    const imageFile = formData.get("image") as File | null;
    if (!imageFile) {
      return NextResponse.json(
        {
          success: false,
          message: "Image file is required",
        },
        { status: 400 }
      );
    }

    const eventData: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (key !== "image") {
        eventData[key] = value;
      }
    }

    console.log("Processing event data:", eventData);

    if (!eventData.slug && eventData.title) {
      eventData.slug = eventData.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    }

    if (eventData.date) {
      const date = new Date(eventData.date);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid date format" },
          { status: 400 }
        );
      }
      eventData.date = date.toISOString().split("T")[0];
    }

    if (eventData.time) {
      const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
      const match = eventData.time.trim().match(timeRegex);

      if (!match) {
        return NextResponse.json(
          { success: false, message: "Invalid time format" },
          { status: 400 }
        );
      }

      let hours = parseInt(match[1]);
      const minutes = match[2];
      const period = match[4]?.toUpperCase();

      if (period) {
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
      }

      if (
        hours < 0 ||
        hours > 23 ||
        parseInt(minutes) < 0 ||
        parseInt(minutes) > 59
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid time values" },
          { status: 400 }
        );
      }

      eventData.time = `${hours.toString().padStart(2, "0")}:${minutes}`;
    }

    if (typeof eventData.agenda === "string") {
      try {
        eventData.agenda = JSON.parse(eventData.agenda);
      } catch {
        eventData.agenda = [eventData.agenda];
      }
    }

    if (typeof eventData.tags === "string") {
      try {
        eventData.tags = JSON.parse(eventData.tags);
      } catch {
        eventData.tags = eventData.tags
          .split(",")
          .map((tag: string) => tag.trim());
      }
    }

    console.log("Uploading image to Cloudinary...");

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "DevEvent",
            allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string });
          }
        );

        uploadStream.end(buffer);
      }
    );

    eventData.image = uploadResult.secure_url;
    console.log("Image uploaded:", uploadResult.secure_url);

    const createdEvent = await Event.create(eventData);
    console.log("Event created successfully:", createdEvent._id);

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        event: {
          id: createdEvent._id.toString(),
          title: createdEvent.title,
          slug: createdEvent.slug,
          date: createdEvent.date,
          location: createdEvent.location,
          image: createdEvent.image,
          createdAt: createdEvent.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Event creation error:", error);

    let statusCode = 500;
    let errorMessage = "Event Creation Failed";

    if (error instanceof Error) {
      if (
        error.message.includes("cloudinary") ||
        error.message.includes("upload")
      ) {
        errorMessage = "Image upload failed";
        statusCode = 400;
      } else if (error.name === "ValidationError") {
        errorMessage = "Validation failed";
        statusCode = 400;
      } else if (
        error.name === "MongoServerError" &&
        error.message.includes("duplicate")
      ) {
        errorMessage = "Event with this slug already exists";
        statusCode = 409;
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: statusCode }
    );
  }
}

// GET ЗАПРОС
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { message: "Event fetching successfully", events},
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Event fetching failed", error: error },
      { status: 500 }
    );
  }
}
