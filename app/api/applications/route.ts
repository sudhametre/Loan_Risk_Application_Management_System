import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM loan_applications ORDER BY application_id DESC"
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to fetch applications" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      applicant_name,
      loan_amount,
      loan_type,
      annual_income,
    } = body;

    if (
      !applicant_name ||
      !loan_amount ||
      !loan_type ||
      !annual_income ||
      Number(loan_amount) <= 0 ||
      Number(annual_income) <= 0
    ) {
      return NextResponse.json(
        { error: "Please enter valid application details" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO loan_applications
       (applicant_name, loan_amount, loan_type, annual_income)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [applicant_name, loan_amount, loan_type, annual_income]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to create application" },
      { status: 500 }
    );
  }
}