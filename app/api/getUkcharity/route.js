import { NextResponse } from "next/server";

import { connectToDatabase } from "../../../lib/db.js";
import ukcharity from "../../../Model/ukCharity.js";

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
    const existingCharity = await ukcharity.findOne({ name });
    if (existingCharity) {
      return NextResponse.json(
        { message: "Charity already exists." },
        { status: 409 },
      );
    }
    const newCharity = new ukcharity({
      name,
      companies,
      Url,
    });
    await newCharity.save();
    return NextResponse.json(
      { message: "UK Charity data saved successfully." },
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
    const data = await ukcharity.find({});
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
