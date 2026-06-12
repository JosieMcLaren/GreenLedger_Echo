import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db.js";
import ukdata from "../../../Model/ukdata.js";

export async function POST(request) {
  const { name, Target, Targetyear, Metric, Baseline, sector } =
    await request.json();
  if (!name) {
    return NextResponse.json({ message: "Name is required." }, { status: 400 });
  }
  try {
    await connectToDatabase();
    const newUkdata = new ukdata({
      name,
      Target,
      Targetyear,
      Metric,
      Baseline,
      sector,
    });
    await newUkdata.save();
    return NextResponse.json(
      { message: "Data saved successfully." },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
