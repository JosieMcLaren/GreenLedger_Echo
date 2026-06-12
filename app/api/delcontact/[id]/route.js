import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db.js";
import contactus from "../../../../Model/contact.js";

export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await connectToDatabase();
    const deletedContact = await contactus.findByIdAndDelete(id);
    if (!deletedContact) {
      return NextResponse.json(
        { message: "Contact not found sorry." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Contact deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
