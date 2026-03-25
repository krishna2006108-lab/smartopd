import { NextRequest, NextResponse } from "next/server";
import { callNext, getSystemState } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = callNext(id);

    if (!result || !result.success) {
      return NextResponse.json({ error: "Doctor not found or error calling next" }, { status: 400 });
    }

    // Return the updated queue for the doctor UI
    const state = getSystemState();
    const doc = state.doctors.find(d => d.id === id);
    const inCabin = doc?.currentPatientId ? state.patients[doc.currentPatientId] : null;
    const upNext = doc?.queue.length ? state.patients[doc.queue[0]] : null;
    
    const queueDetails = doc?.queue.map(pid => state.patients[pid]);

    return NextResponse.json({
      success: true,
      doctor: doc,
      inCabin,
      upNext,
      queueDetails
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
