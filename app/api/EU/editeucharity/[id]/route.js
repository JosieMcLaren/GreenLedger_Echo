import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db.js";
import eualiance from "../../../../../Model/eucharity.js";

export async function PATCH(request, context) {
  const { id } = await context.params;
  const { action, company, Url, sector } = await request.json();
  try {
    await connectToDatabase();
    const charity = await eualiance.findById(id);
    if (!charity) {
      return NextResponse.json(
        { message: "Charity not found." },
        { status: 404 }
      );
    }
    if (action === "add-company") {
      if (!company) {
        return NextResponse.json(
          { message: "Company name is required." },
          { status: 400 }
        );
      }
      if (!charity.companies.includes(company)) {
        charity.companies.push(company);
        await charity.save();
      }
      return NextResponse.json(
        { message: "Company added successfully." },
        { status: 200 }
      );
    } else if (action === "remove-company") {
      if (!company) {
        return NextResponse.json(
          { message: "Company name is required." },
          { status: 400 }
        );
      }
      charity.companies = charity.companies.filter((c) => c !== company);
      await charity.save();
      return NextResponse.json(
        { message: "Company removed successfully." },
        { status: 200 }
      );
    } else if (action === "delete-charity") {
      await eualiance.findByIdAndDelete(id);
      return NextResponse.json(
        { message: "Charity deleted successfully." },
        { status: 200 }
      );
    } else if (action === "update-Url") {
      charity.Url = Url;
      await charity.save();
      return NextResponse.json(
        { message: "Url updated successfully." },
        { status: 200 }
      );
    } else if (action === "update-sector") {
      charity.sector = sector !== undefined ? sector : "";
      await charity.save();
      return NextResponse.json(
        { message: "Sector updated successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Invalid action." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
