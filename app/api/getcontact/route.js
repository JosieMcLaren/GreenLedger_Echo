import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db.js";
import contact from "../../../Model/contact.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    await connectToDatabase();
    const data = await contact.find({});
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const newContact = new contact({
      name,
      email,
      subject,
      message,
    });

    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["mclaren@newcaslt.ac.uk"],
      subject: "New Contact Form Submission",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #e6e6e6;">
        
        <div style="background: #000; color: #fff; padding: 15px 25px;">
          <h2 style="margin: 0; font-size: 20px;">📩 New Contact Form Message</h2>
        </div>

        <div style="padding: 25px;">
          <p style="font-size: 16px; margin-bottom: 10px;">
            <strong style="color: #333;">Name:</strong> ${name}
          </p>

          <p style="font-size: 16px; margin-bottom: 10px;">
            <strong style="color: #333;">Email:</strong> ${email}
          </p>

          <p style="font-size: 16px; margin-bottom: 10px;">
            <strong style="color: #333;">Message:</strong><br>
            <span style="white-space: pre-line; color: #555;">${message}</span>
          </p>
        </div>

        <div style="padding: 15px 25px; background: #fafafa; border-top: 1px solid #eee; text-align: center; font-size: 14px; color: #777;">
          This message was sent from your Waste food report site contact form.
        </div>

      </div>
    </div>
  `,
    });
    await newContact.save();
    return NextResponse.json(
      { message: "Contact message saved successfully." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
