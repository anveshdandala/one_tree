import { auth } from "@clerk/nextjs/server";
import { ThemeToggle } from "../../components/themes/ToggleWrapper";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import HomePageContent from "./HomePageContent.jsx";
// import { useUser } from "@clerk/nextjs";

export default async function HomePage() {
  const { userId, getToken } = await auth();
  console.log("User ID:", userId);

  if (!userId) {
    return <div>Not signed in</div>;
  }
  //   dont use this in client components as it contains meta data, use useUser instead
  //   use auth() if we only need userId
  const token = await getToken(); // Clerk JWT

  const syncResponse = await fetch(`${process.env.API_URL}/api/users/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  console.log("Sync response status:", syncResponse.status);
  const syncData = await syncResponse.json();
  console.log("local user id:", syncData.id);
  return (
    <div className="min-h-screen bg-canvas-bg font-sans text-canvas-text selection:bg-canvas-text/10 selection:text-canvas-text transition-colors duration-250">
      <header className="border-b border-canvas-border bg-canvas-bg/90 px-4 py-4 transition-colors duration-250 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-6 w-6 items-center justify-center border border-canvas-text bg-transparent">
              <div className="h-2.5 w-2.5 rotate-45 bg-canvas-text" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-canvas-text">
              one Tree
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl="/home">
                <button
                  type="button"
                  className="border border-canvas-border-strong px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-canvas-muted transition-colors duration-200 hover:border-canvas-text hover:bg-canvas-secondary hover:text-canvas-text"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/home">
                <button
                  type="button"
                  className="border border-canvas-inverse-bg bg-canvas-inverse-bg px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-canvas-inverse-text transition-colors duration-200 hover:opacity-85"
                >
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
            <ThemeToggle className="border border-canvas-border-strong px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-canvas-muted transition-colors duration-200 hover:border-canvas-text hover:bg-canvas-secondary hover:text-canvas-text" />
          </div>
        </div>
      </header>
      <main>
        <HomePageContent branches={syncData?.branches ?? []} />
      </main>
    </div>
  );
}

// "use client";

// import { useUser } from "@clerk/nextjs";

// export default function DashboardPage() {
//   const { isLoaded, isSignedIn, user } = useUser();

//   if (!isLoaded) return <div>Loading...</div>;
//   if (!isSignedIn) return <div>Not signed in</div>;

//   return (
//     <main>
//       <h1>Dashboard</h1>
//       <p>User ID: {user.id}</p>
//       <p>Name: {user.firstName}</p>
//       <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
//     </main>
//   );
// }
