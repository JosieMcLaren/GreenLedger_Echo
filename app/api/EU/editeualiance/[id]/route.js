import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db.js";
import eualiance from "../../../../../Model/eualiance.js";

export async function PATCH(request, context) {
  const { id } = await context.params;
  const { action, company, link } = await request.json();

  try {
    await connectToDatabase();
    const alliance = await eualiance.findById(id);
    if (!alliance) {
      return NextResponse.json(
        { message: "Alliance not found." },
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
      if (!alliance.companies.includes(company)) {
        alliance.companies.push(company);
        await alliance.save();
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
      alliance.companies = alliance.companies.filter((c) => c !== company);
      await alliance.save();
      return NextResponse.json(
        { message: "Company removed successfully." },
        { status: 200 }
      );
    } else if (action === "delete-alliance") {
      // if (!id) {
      //   console.log("id needed to delte the contact details");
      // }
      await eualiance.findByIdAndDelete(id);
      return NextResponse.json(
        { message: "Alliance deleted successfully." },
        { status: 200 }
      );
    } else if (action === "update-link") {
      if (!link) {
        return NextResponse.json(
          { message: "Link is required." },
          { status: 400 }
        );
      }
      alliance.link = link;
      await alliance.save();
      return NextResponse.json(
        { message: "Link updated successfully." },
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

export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await connectToDatabase();
    await eualiance.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Alliance deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
