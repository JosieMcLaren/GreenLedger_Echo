import { NextResponse } from "next/server";

import { connectToDatabase } from "../../../../lib/db.js";

import eucompany from "../../../../Model/eucompany.js";



export async function POST(request) {

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

console.log("Received POST data:", { companyName, Commitment, targetDate, TargetMetric, Standardised, fromBaseline, toBaseline, sector });

    const exisitngCompany = await eucompany.findOne({ companyName, sector });

    if (exisitngCompany) {

      return NextResponse.json(

        { message: "Company already exists." },

        { status: 400 },

      );

    }

    const newCompany = new eucompany({

      companyName,

      Commitment,

      targetDate,

      TargetMetric,

      Standardised,

      fromBaseline,

      toBaseline,

      sector,

    });

    await newCompany.save();

    return NextResponse.json(

      { message: "Company data added successfully.", data: newCompany },

      { status: 201 },

    );

  } catch (error) {

    return NextResponse.json(

      { message: "Internal Server Error" },

      { status: 500 },

    );

  }

}



export async function GET() {

  try {

    await connectToDatabase();

    const companies = await eucompany.find().sort({ companyName: 1 });



    return NextResponse.json(

      { message: "Companies fetched successfully.", data: companies },

      { status: 200 },

    );

  } catch (error) {

    return NextResponse.json(

      { message: "Internal Server Error" },

      { status: 500 },

    );

  }

}

