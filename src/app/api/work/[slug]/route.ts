import { NextResponse } from "next/server";
import { findCaseStudy } from "@/lib/work";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const study = findCaseStudy(slug);

  if (!study) {
    return NextResponse.json({ error: "case study not found" }, { status: 404 });
  }

  return NextResponse.json(study);
}
