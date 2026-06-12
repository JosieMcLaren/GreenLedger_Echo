import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db.js";
import ukdata from "../../../../Model/ukdata.js";

export async function PATCH(request, context) {
  try {
    await connectToDatabase();

    const { id } = await context.params;
    const { name, Target, Targetyear, Metric, Baseline, sector } =
      await request.json();

    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (Target !== undefined) updatePayload.Target = Target;
    if (Targetyear !== undefined) updatePayload.Targetyear = Targetyear;
    if (Metric !== undefined) updatePayload.Metric = Metric;
    if (Baseline !== undefined) updatePayload.Baseline = Baseline;
    if (sector !== undefined) updatePayload.sector = sector;
    console.log("Received PATCH data:", { id, ...updatePayload });
    const updatedUkData = await ukdata.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      {
        new: true,
        runValidators: true,
        strict: false,
      }
    );

    if (!updatedUkData) {
      return NextResponse.json(
        { message: "Company target not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "UK Company target data updated successfully.",
        data: updatedUkData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await connectToDatabase();
    const deletedUkData = await ukdata.findByIdAndDelete(id);
    if (!deletedUkData) {
      return NextResponse.json(
        { message: "Company target not found." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "UK Company target data deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
