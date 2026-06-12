import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db.js";
import ukcom from "../../../../Model/ukcompany.js";

export async function PATCH(request, context) {
  try {
    await connectToDatabase();

    const { id } = await context.params;
    const { company, color, sector } = await request.json();

    const updatePayload = {};
    if (company !== undefined) updatePayload.company = company;
    if (color !== undefined) updatePayload.color = color;
    if (sector !== undefined) updatePayload.sector = sector;

    const currentDoc = await ukcom.findById(id);
    if (!currentDoc) {
      return NextResponse.json({ message: "Company not found." }, { status: 404 });
    }
    const targetSector =
      sector !== undefined ? sector : (currentDoc.sector ?? "");

    if (color) {
      const existingColor = await ukcom.findOne({
        color,
        sector: targetSector,
        _id: { $ne: id },
      });
      if (existingColor) {
        return NextResponse.json(
          { message: "Color already in use." },
          { status: 409 }
        );
      }
    }

    if (company) {
      const existingCompany = await ukcom.findOne({
        company,
        sector: targetSector,
        _id: { $ne: id },
      });
      if (existingCompany) {
        return NextResponse.json(
          { message: "Company already exists." },
          { status: 409 }
        );
      }
    }

    const updatedUkCom = await ukcom.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });

    if (!updatedUkCom) {
      return NextResponse.json(
        { message: "Company not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "UK Company data updated successfully.",
        data: updatedUkCom,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH ERROR:", error);
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
    const deletedUkCom = await ukcom.findByIdAndDelete(id);
    if (!deletedUkCom) {
      return NextResponse.json(
        { message: "Company not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "UK Company data deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
