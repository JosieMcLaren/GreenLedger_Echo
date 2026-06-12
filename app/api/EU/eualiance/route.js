import { NextResponse } from "next/server";

import { connectToDatabase } from "../../../../lib/db.js";
import eualliances from "../../../../Model/eualiance.js";

export async function POST(request) {
  const { name, companies, link } = await request.json();
  if (!name || !companies) {
    return NextResponse.json(
      { message: "Name and companies are required fields." },
      { status: 400 },
    );
  }
  try {
    await connectToDatabase();
    const existingAlliance = await eualliances.findOne({ name });
    if (existingAlliance) {
      return NextResponse.json(
        { message: "Alliance already exists." },
        { status: 409 },
      );
    }
    const newAlliance = new eualliances({
      name,
      companies,
      link,
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
    const data = await eualliances.find({});
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
