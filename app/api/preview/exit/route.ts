import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/** Exit draft preview (docs/cmd.md) — clears draft mode and returns home. */
export const runtime = "nodejs";

export async function GET() {
  (await draftMode()).disable();
  redirect("/");
}
