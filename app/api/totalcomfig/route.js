import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db.js";
import eudata from "../../../Model/eucompany.js";
import ukdata from "../../../Model/ukdata.js";

export async function GET() {
  try {
    await connectToDatabase();
    const euCompanies = await eudata.find({});
    const ukCompanies = await ukdata.find({});
    const eucom = euCompanies.length;
    const ukcom = ukCompanies.length;
    // const totalCompanies = euCompanies.length + ukCompanies.length;
    return NextResponse.json({ eucom, ukcom }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
