
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";


export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("loan_risk_nosql");

    const documents = await db
      .collection("loan_documents")
      .find({})
      .sort({ uploaded_at: -1 })
      .toArray();

    return NextResponse.json(documents);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to fetch loan documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db("loan_risk_nosql");

    const result = await db.collection("loan_documents").insertOne({
      application_id: Number(body.application_id),
      applicant_name: body.applicant_name,
      document_type: body.document_type,
      description: body.description || "",
      uploaded_at: new Date(),
    });

    return NextResponse.json({
      message: "Loan document saved successfully",
      document_id: result.insertedId,
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to save loan document" },
      { status: 500 }
    );
  }
}
