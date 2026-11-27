import { redirect } from "next/navigation";

export default function DutchHome() {
  redirect("/?lang=nl");
}
