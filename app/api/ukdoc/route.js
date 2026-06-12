import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db.js";
import ukdata from "../../../Model/ukdocument.js";
export async function POST(request) {
  const { from, to, annualReport, sustainability, ESG, other } =
    await request.json();
  if (!from || !to) {
    return NextResponse.json(
      { message: "From and To years are required." },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();
    const newUkdata = new ukdata({
      from,
      to,
      annualReport,
      sustainability,
      ESG,
      other,
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

export async function GET() {
  try {
    await connectToDatabase();
    const data = await ukdata.find({});
    const totalAnnual = data.reduce(
      (sum, doc) => sum + (doc.annualReport || 0),
      0,
    );
    const totalSustainability = data.reduce(
      (sum, doc) => sum + (doc.sustainability || 0),
      0,
    );
    const totalOther = data.reduce((sum, doc) => sum + (doc.other || 0), 0);
    const totalESG = data.reduce((sum, doc) => sum + (doc.ESG || 0), 0);

    const totalReports =
      totalAnnual + totalSustainability + totalOther + totalESG;

    return NextResponse.json(
      {
        data,
        totals: {
          totalAnnual,
          totalSustainability,
          totalOther,
          totalESG,
          totalReports,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
