import { redirect } from "next/navigation";

// Legacy route: '' -> /home
export default function Index() {
  redirect("/home");
}
