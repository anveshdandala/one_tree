import { auth } from "@clerk/nextjs/server";

function forwardResponse(text, res) {
  return new Response(text, {
    status: res.status,
    headers: {
      "Content-Type":
        res.headers.get("content-type") || "application/json; charset=utf-8",
    },
  });
}

export async function GET(_request, { params }) {
  const { getToken } = await auth();
  const token = await getToken();
  const { path } = await params;
  const url = `${process.env.API_URL}/api/${path.join("/")}`;

  console.log("Calling:", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  const text = await res.text();
  return forwardResponse(text, res);
}

export async function POST(request, { params }) {
  const { getToken } = await auth();
  const token = await getToken();
  const { path } = await params;
  const body = await request.json();
  const url = `${process.env.API_URL}/api/${path.join("/")}`;
  console.log("Calling:", url);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return forwardResponse(text, res);
}

export async function PATCH(request, { params }) {
  const { getToken } = await auth();
  const token = await getToken();
  const { path } = await params;
  const body = await request.json();
  const url = `${process.env.API_URL}/api/${path.join("/")}`;
  console.log("Calling:", url);
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return forwardResponse(text, res);
}
