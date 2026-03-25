import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true });
  res.cookies.set("smartopd_admin", "", { maxAge: 0, path: "/" });
  return res;
}
