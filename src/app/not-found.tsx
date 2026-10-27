import { redirect } from "next/navigation";

// Legacy fallback route: '**' -> ''
export default function NotFound() {
  redirect("/home");
}
