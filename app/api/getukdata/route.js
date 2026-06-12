import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db.js";
import ukdata from "../../../Model/ukdata.js";

export async function GET() {
  try {
    await connectToDatabase();
    const data = await ukdata.find({}).sort({ name: 1 });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
