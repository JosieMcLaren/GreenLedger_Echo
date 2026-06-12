import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db.js";
import eudata from "../../../../Model/eucomdata.js";

export async function GET() {
  try {
    await connectToDatabase();
    const companies = await eudata.find({});

    let minFrom = Infinity;
    let maxTo = -Infinity;

    companies.forEach((company) => {
      if (!Array.isArray(company.data)) return;

      company.data.forEach((entry) => {
        const from = Number(entry?.from);
        const to = Number(entry?.to);

        if (!isNaN(from) && from < minFrom) minFrom = from;
        if (!isNaN(to) && to > maxTo) maxTo = to;
      });
    });

    // if nothing found return null instead of Infinity/-Infinity
    if (minFrom === Infinity) minFrom = null;
    if (maxTo === -Infinity) maxTo = null;

    return NextResponse.json({ minFrom, maxTo }, { status: 200 });
  } catch (error) {
    console.error("GET /eucompany error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
