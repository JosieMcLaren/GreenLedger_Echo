import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db.js";
import ukdata from "../../../Model/ukdata.js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let ukdataCache = null;
let ukdataCacheTime = 0;
const CACHE_DURATION = 20000;

export async function GET() {
  try {
    const now = Date.now();
    if (ukdataCache && now - ukdataCacheTime < CACHE_DURATION) {
      return NextResponse.json(ukdataCache, { status: 200 });
    }

    await connectToDatabase();
    const data = await ukdata.find({}).sort({ name: 1 }).lean();
    ukdataCache = data;
    ukdataCacheTime = now;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
