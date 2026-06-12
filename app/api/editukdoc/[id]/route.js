import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db.js";
import ukdata from "../../../../Model/ukdocument.js";

export async function PATCH(request, context) {
  const { id } = await context.params;
  const { from, to, annualReport, sustainability, ESG, other } =
    await request.json();
  try {
    await connectToDatabase();
    const updatedData = await ukdata.findByIdAndUpdate(
      id,
      { from, to, annualReport, sustainability, ESG, other },
      { new: true },
    );
    if (!updatedData) {
      return NextResponse.json({ message: "Data not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Data updated successfully.", data: updatedData },
      { status: 200 },
    );
  } catch (error) {
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
    const deletedData = await ukdata.findByIdAndDelete(id);
    if (!deletedData) {
      return NextResponse.json({ message: "Data not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Data deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
