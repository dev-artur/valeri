import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_TAG } from "@/sanity/client";

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  // Сайт маленький: любая публикация сбрасывает весь контент сразу, без stale-ответов.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  return Response.json({ revalidated: true, type: body?._type ?? null });
}
