import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "loan_vector_db",
  user: "postgres",
  password: process.env.DB_PASSWORD,
});

export default pool;