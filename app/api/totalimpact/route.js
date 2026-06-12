import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db.js";
import ukcompany from "../../../Model/ukcompany.js";

export async function GET() {
  try {
    await connectToDatabase();

    const result = await ukcompany.aggregate([
      { $unwind: "$data" },
      {
        $group: {
          _id: null,
          totalFoodHandled: { $sum: "$data.foodHandled" },
          totalUnsoldFood: { $sum: "$data.unsoldFood" },
          totalHumanRedistribution: { $sum: "$data.humanRedistribution" },
        },
      },
    ]);

    const {
      totalFoodHandled = 0,
      totalUnsoldFood = 0,
      totalHumanRedistribution = 0,
    } = result[0] || {};

    return NextResponse.json(
      {
        totalFoodHandledInBillions: (totalFoodHandled / 1e9).toFixed(2),
        totalUnsoldFoodInBillions: (totalUnsoldFood / 1e6).toFixed(2),
        totalHumanRedistributionInBillions: (
          totalHumanRedistribution / 1e6
        ).toFixed(2),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
