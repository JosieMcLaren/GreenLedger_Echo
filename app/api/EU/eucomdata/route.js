import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db.js";
import eucomdata from "../../../../Model/eucomdata.js";

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
    const compoanyy = company.toLowerCase();
    if (!compoanyy) {
      console.log("the err is coming from the lower case converting");
    }

    const existingCompany = await eucomdata.findOne({ company, sector });
    if (existingCompany) {
      return NextResponse.json(
        {
          message:
            "Sorry unabe to add because it's alredy exit in current database",
        },
        { status: 409 },
      );
    }
    const existingcolor = await eucomdata.findOne({ color, sector });
    if (existingcolor) {
      return NextResponse.json(
        { message: "Color already in use." },
        { status: 409 },
      );
    }
    const newEuCom = new eucomdata({
      sector,
      company,
      color,
      data,
    });
    await newEuCom.save();
    return NextResponse.json(
      { message: "EU Company data saved successfully." },
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
    const data = await eucomdata.find({});
    if (!data) {
      console.log("the data is not loadded propeprly");
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
