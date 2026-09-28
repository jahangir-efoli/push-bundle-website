import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * On-demand ISR (docs/PLAN.md §7; Phase 9 brief). The CMS calls this whenever
 * content changes, so edits appear within seconds without a redeploy.
 * Token-gated against REVALIDATE_SECRET. Without it, CMS content is stale.
 */
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-token") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let path: string | undefined;
  try {
    ({ path } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!path) {
    return NextResponse.json({ error: "path required" }, { status: 400 });
  }

  // Refresh the specific path the CMS names, plus everything CMS-tagged
  // (covers listings/teasers that surface the changed item). Next 16 requires
  // a cacheLife profile as revalidateTag's second argument.
  revalidatePath(path);
  revalidateTag("cms", "max");

  return NextResponse.json({ revalidated: true, path });
}
