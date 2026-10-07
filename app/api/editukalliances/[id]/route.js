import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db.js";
import ukalliances from "../../../../Model/ukAlliances.js";

export async function PATCH(request, context) {
  const { id } = await context.params;
  const { action, company, Url, sector } = await request.json();
  if (!id) {
    return NextResponse.json(
      { message: "Alliance ID is required." },
      { status: 400 }
    );
  }
  try {
    await connectToDatabase();
    const alliance = await ukalliances.findById(id);

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
      await ukalliances.findByIdAndDelete(id);

      return NextResponse.json(
        { message: "Alliance deleted successfully." },
        { status: 200 }
      );
    } else if (action === "update-url") {
      if (Url === undefined) {
        return NextResponse.json(
          { message: "URL is required." },
          { status: 400 }
        );
      }
      alliance.Url = Url;
      await alliance.save();
      return NextResponse.json(
        { message: "URL updated successfully." },
        { status: 200 }
      );
    } else if (action === "update-sector") {
      alliance.sector = sector !== undefined ? sector : "";
      await alliance.save();
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

export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await connectToDatabase();
    await ukalliances.findByIdAndDelete(id);
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
