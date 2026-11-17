# Loan Risk & Application Management System

A database-driven web application designed to manage loan applications, assess applicant risk, store loan documents, and perform vector similarity searches.

## Team Members

| Name | SRN |
|---|---|
| Shweta Mailaragouda Patil | PES2UG25CS825 |
| Soubhagya | PES2UG25CS827 |



## Project Overview

The Loan Risk & Application Management System provides a platform to manage loan applications and applicant information. It integrates relational database management, NoSQL document storage, and vector search capabilities.

## Technology Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Relational Database:** PostgreSQL
- **Vector Database:** PostgreSQL with pgvector
- **NoSQL Database:** MongoDB
- **Backend:** Next.js API Routes

## Key Features

- Submit and manage loan applications.
- View applicant and loan details.
- Perform loan risk assessments.
- Store and retrieve loan-related documents.
- Search similar loan records using vector similarity.
- View application information through a dashboard.

## Database Components

### PostgreSQL
Stores structured loan application data and applicant details.

### MongoDB
Stores loan-related documents and verification records.

### pgvector
Stores vector embeddings and supports similarity searches using cosine distance.

## API Routes

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/applications` | GET, POST | Retrieve and submit applications |
| `/api/assess-risk` | POST | Assess applicant risk |
| `/api/loan-documents` | GET, POST | Manage loan documents |
| `/api/vector-search` | POST | Perform vector similarity search |

## Project Structure

```text
LoanRisk_Submission/
├── app/
│   ├── api/
│   │   ├── applications/
│   │   ├── assess-risk/
│   │   ├── loan-documents/
│   │   └── vector-search/
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── db.ts
│   └── mongodb.ts
├── public/
├── package.json
├── package-lock.json
└── README.md
```

## Running the Project

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Configure the required database connection environment variables in `.env.local`.
4. Start the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000` in your browser.

## Project Scope

This project demonstrates the integration of SQL, NoSQL, and vector database technologies in a loan application management system.

---

**Academic DBMS Project – PES University, 2026**
