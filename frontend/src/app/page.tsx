import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server-data";
import { LandingPage } from "@/components/landing/LandingPage";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}

