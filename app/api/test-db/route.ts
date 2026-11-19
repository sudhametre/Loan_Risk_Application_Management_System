import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    return NextResponse.json({
      message: "PostgreSQL connected successfully!",
      time: result.rows[0].current_time,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}