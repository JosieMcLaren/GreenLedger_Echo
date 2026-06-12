import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db.js";
import eucompany from "../../../../../Model/eucompany.js";

export async function PATCH(request, context) {
  const { id } = await context.params;
  const {
    companyName,
    Commitment,
    targetDate,
    TargetMetric,
    Standardised,
    fromBaseline,
    toBaseline,
    sector,
  } = await request.json();
  try {
    await connectToDatabase();
    const updatePayload = {};
    if (companyName !== undefined) updatePayload.companyName = companyName;
    if (Commitment !== undefined) updatePayload.Commitment = Commitment;
    if (targetDate !== undefined) updatePayload.targetDate = targetDate;
    if (TargetMetric !== undefined) updatePayload.TargetMetric = TargetMetric;
    if (Standardised !== undefined) updatePayload.Standardised = Standardised;
    if (fromBaseline !== undefined) updatePayload.fromBaseline = fromBaseline;
    if (toBaseline !== undefined) updatePayload.toBaseline = toBaseline;
    if (sector !== undefined) updatePayload.sector = sector;

    const updatedCompany = await eucompany.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      {
        new: true,
        runValidators: true,
        strict: false,
      }
    );
    if (!updatedCompany) {
      return NextResponse.json(
        { message: "Company not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Company updated successfully.", data: updatedCompany },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await connectToDatabase();
    const deletedCompany = await eucompany.findByIdAndDelete(id);
    if (!deletedCompany) {
      return NextResponse.json(
        { message: "Company not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Company deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
