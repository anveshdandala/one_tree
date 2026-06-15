import { auth } from "@clerk/nextjs/server";
import HomeGraph from "./GraphEditorPage";

export default async function GraphPage() {
  const { getToken } = await auth();
  const token = await getToken();

  let branches = [];
  try {
    const res = await fetch(`${process.env.API_URL}/api/branches`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        branches = data;
      } else {
        console.error("Fetched branches is not an array:", data);
      }
    } else {
      console.error("Failed to fetch branches. Status:", res.status);
    }
  } catch (error) {
    console.error("Error fetching branches on server page:", error);
  }

  return <HomeGraph branches={branches} edges={[]} />;
}
