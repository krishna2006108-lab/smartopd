import { NextRequest, NextResponse } from "next/server";
import { skipCurrentPatient, getSystemState } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = skipCurrentPatient(id);

    if (!result || !result.success) {
      return NextResponse.json({ error: "Doctor not found or error skipping" }, { status: 400 });
    }

    const state = getSystemState();
    const doc = state.doctors.find(d => d.id === id);
    const inCabin = doc?.currentPatientId ? state.patients[doc.currentPatientId] : null;
    const queueDetails = doc?.queue.map(pid => state.patients[pid]);

    return NextResponse.json({
      success: true,
      message: "Patient skipped and reinserted to the end of the queue",
      inCabin,
      queueDetails
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
