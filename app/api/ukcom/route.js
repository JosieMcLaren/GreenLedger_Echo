import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db.js";
import ukcom from "../../../Model/ukcompany.js";

export async function POST(request) {
  const { company, color, data, sector } = await request.json();
  if (!company || !color) {
    return NextResponse.json(
      { message: "Company and color are required fields." },
      { status: 400 },
    );
  }
  try {
    await connectToDatabase();
    const existingCompany = await ukcom.findOne({ company, sector });
    if (existingCompany) {
      return NextResponse.json(
        { message: "Company already exists." },
        { status: 409 },
      );
    }
    const existingcolor = await ukcom.findOne({ color, sector });
    if (existingcolor) {
      return NextResponse.json(
        { message: "Color already in use." },
        { status: 409 },
      );
    }
    const newUkCom = new ukcom({
      sector,
      company,
      color,
      data,
    });
    await newUkCom.save();
    return NextResponse.json(
      { message: "UK Company data saved successfully." },
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
    const data = await ukcom.find({});
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
