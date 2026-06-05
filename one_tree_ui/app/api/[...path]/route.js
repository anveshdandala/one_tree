import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const { getToken } = await auth();
  const token = await getToken();
  const { path } = await params; // ← await params

  const res = await fetch(`${process.env.API_URL}/api/${path.join("/")}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request, { params }) {
  const { getToken } = await auth();
  const token = await getToken();
  const { path } = await params; // ← await params

  const body = await request.json(); // ← also fix this, was passing object not string

  const res = await fetch(`${process.env.API_URL}/api/${path.join("/")}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body), // ← stringify it
  });

  const data = await res.json();
  return NextResponse.json(data);
}
