import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db.js";
import eudata from "../../../Model/eucompany.js";
import ukdata from "../../../Model/ukdata.js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let totalComCache = null;
let totalComCacheTime = 0;
const CACHE_DURATION = 30000;

export async function GET() {
  try {
    const now = Date.now();
    if (totalComCache && now - totalComCacheTime < CACHE_DURATION) {
      return NextResponse.json(totalComCache, { status: 200 });
    }

    await connectToDatabase();
    const [eucom, ukcom] = await Promise.all([
      eudata.countDocuments({}),
      ukdata.countDocuments({}),
    ]);

    totalComCache = { eucom, ukcom };
    totalComCacheTime = now;

    return NextResponse.json({ eucom, ukcom }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
