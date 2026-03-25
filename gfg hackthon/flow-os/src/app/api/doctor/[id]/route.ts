import { NextRequest, NextResponse } from "next/server";
import { getSystemState } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const state = getSystemState();
    
    const doc = state.doctors.find(d => d.id === id);
    if (!doc) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const inCabin = doc.currentPatientId ? state.patients[doc.currentPatientId] : null;
    const upNext = doc.queue.length > 0 ? state.patients[doc.queue[0]] : null;
    const queueDetails = doc.queue.map(pid => state.patients[pid]);

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
