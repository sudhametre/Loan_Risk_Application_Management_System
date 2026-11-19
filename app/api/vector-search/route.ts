
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { embedding } = await request.json();

    if (
      !Array.isArray(embedding) ||
      embedding.length !== 3 ||
      !embedding.every((value) => Number.isFinite(value))
    ) {
      return NextResponse.json(
        { error: "A valid 3-dimensional embedding is required" },
        { status: 400 }
      );
    }

    const vector = `[${embedding.join(",")}]`;

    const result = await pool.query(
      `SELECT
        l.application_id,
        l.applicant_name,
        l.loan_amount,
        l.annual_income,
        l.status,
        l.risk_level,
        e.description,
        e.embedding <=> $1::vector AS distance
      FROM loan_embeddings e
      JOIN loan_applications l
        ON e.application_id = l.application_id
      ORDER BY e.embedding <=> $1::vector
      LIMIT 2`,
      [vector]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Vector search failed" },
      { status: 500 }
    );
  }
}
