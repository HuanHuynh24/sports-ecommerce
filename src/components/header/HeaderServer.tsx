import { cookies } from "next/headers";
import HeaderClient from "./HeaderClient";

export default async function HeaderServer() {
  const cookieStore = await cookies(); 
  const username = cookieStore.get("username")?.value || null;

  return <HeaderClient initialUsername={username} />;
}
