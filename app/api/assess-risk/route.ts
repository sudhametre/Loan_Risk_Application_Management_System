
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { application_id } = await request.json();

    if (!application_id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT loan_amount, annual_income
       FROM loan_applications
       WHERE application_id = $1`,
      [application_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const { loan_amount, annual_income } = result.rows[0];
    const ratio = Number(loan_amount) / Number(annual_income);

    let risk_level = "High";

    if (ratio <= 0.5) {
      risk_level = "Low";
    } else if (ratio <= 1) {
      risk_level = "Medium";
    }

    const updated = await pool.query(
      `UPDATE loan_applications
       SET risk_level = $1
       WHERE application_id = $2
       RETURNING *`,
      [risk_level, application_id]
    );

    return NextResponse.json({
      message: "Risk assessment completed",
      ratio,
      application: updated.rows[0],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Risk assessment failed" },
      { status: 500 }
    );
  }
}
