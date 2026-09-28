import { NextResponse } from "next/server";
import { CASE_STUDIES, DISCIPLINES, type Discipline } from "@/lib/work";

// The sandbox serves its own content rather than proxying a third-party API,
// but it still goes over HTTP so the work section exercises real async
// loading, filtering and error states against an endpoint.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const discipline = params.get("discipline");
  if (discipline && !DISCIPLINES.includes(discipline as Discipline)) {
    return NextResponse.json(
      { error: `unknown discipline; expected one of ${DISCIPLINES.join(", ")}` },
      { status: 400 }
    );
  }

  const limitParam = params.get("limit");
  const limit = limitParam ? Number.parseInt(limitParam, 10) : null;
  if (limitParam !== null && (limit === null || Number.isNaN(limit) || limit < 1)) {
    return NextResponse.json(
      { error: "`limit` must be a positive integer" },
      { status: 400 }
    );
  }

  let studies = CASE_STUDIES;
  if (discipline) {
    studies = studies.filter((study) =>
      study.disciplines.includes(discipline as Discipline)
    );
  }
  if (limit) {
    studies = studies.slice(0, limit);
  }

  return NextResponse.json(studies);
}
