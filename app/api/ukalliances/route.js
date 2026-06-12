import { NextResponse } from "next/server";

import { connectToDatabase } from "../../../lib/db.js";
import ukalliances from "../../../Model/ukAlliances.js";

export async function POST(request) {
  const { name, companies, Url } = await request.json();
  if (!name || !companies) {
    return NextResponse.json(
      { message: "Name and companies are required fields." },
      { status: 400 },
    );
  }
  try {
    await connectToDatabase();
    const existingAlliance = await ukalliances.findOne({ name });
    if (existingAlliance) {
      return NextResponse.json(
        { message: "Alliance already exists." },
        { status: 409 },
      );
    }
    const newAlliance = new ukalliances({
      name,
      companies,
      Url,
    });
    await newAlliance.save();
    return NextResponse.json(
      { message: "UK Alliance data saved successfully." },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const data = await ukalliances.find({});
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
