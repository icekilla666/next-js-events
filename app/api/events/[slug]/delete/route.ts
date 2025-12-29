import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    console.log("=== DELETE REQUEST ===");

    const { slug } = await params;
    console.log("Slug from params:", slug);

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Event slug is required" },
        { status: 400 }
      );
    }

    await connectDB();
    console.log("Connected to database");

    let deletedEvent;

    deletedEvent = await Event.findOneAndDelete({ slug });

    if (!deletedEvent && slug.length === 24) {
      deletedEvent = await Event.findByIdAndDelete(slug);
    }

    if (!deletedEvent) {
      console.log("Event not found for slug/ID:", slug);
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
          slug,
        },
        { status: 404 }
      );
    }

    console.log("Event deleted successfully:", deletedEvent.title);

    return NextResponse.json(
      {
        success: true,
        message: "Event deleted successfully",
        data: {
          id: deletedEvent._id,
          title: deletedEvent.title,
          slug: deletedEvent.slug,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
