import { NextRequest, NextResponse } from "next/server";
import { getPatientLiveStatus } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = getPatientLiveStatus(id);

    if (!data) {
      return NextResponse.json({ error: "Patient token not found or expired" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
