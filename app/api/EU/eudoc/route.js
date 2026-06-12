import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db.js";
import eudata from "../../../../Model/eudoc.js";
export async function POST(request) {
  const { from, to, annualReport, sustainability, integratedReport, other } =
    await request.json();
  if (!from || !to) {
    return NextResponse.json(
      { message: "From and To years are required." },
      { status: 400 },
    );
  }
  try {
    await connectToDatabase();
    const neweudata = new eudata({
      from,
      to,
      annualReport,
      sustainability,
      integratedReport,
      other,
    });
    await neweudata.save();
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
    const data = await eudata.find({});
    const totalAnnual = data.reduce(
      (sum, doc) => sum + (doc.annualReport || 0),
      0,
    );
    const totalSustainability = data.reduce(
      (sum, doc) => sum + (doc.sustainability || 0),
      0,
    );
    const totalIntegrated = data.reduce(
      (sum, doc) => sum + (doc.integratedReport || 0),
      0,
    );
    const totalOther = data.reduce((sum, doc) => sum + (doc.other || 0), 0);

    const totalReports =
      totalAnnual + totalSustainability + totalOther + totalIntegrated;

    return NextResponse.json(
      {
        data,
        totals: {
          totalAnnual,
          totalSustainability,
          totalIntegrated,
          totalOther,
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
