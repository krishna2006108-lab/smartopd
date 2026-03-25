import { NextResponse } from "next/server";
import { getSystemState } from "@/lib/db";

export async function GET() {
  const state = getSystemState();

  const doctorsList = state.doctors.map(doc => {
    const currentPatient = doc.currentPatientId ? state.patients[doc.currentPatientId] : null;
    const queueTokens = doc.queue.map(pid => {
      const p = state.patients[pid];
      return p ? { id: p.id, tokenId: p.tokenId, name: p.name } : null;
    }).filter(Boolean);

    return {
      id: doc.id,
      name: doc.name,
      department: doc.department,
      room: doc.room,
      queueLength: doc.queue.length,
      patientsSeenToday: doc.patientsSeenToday,
      averageWaitMins: Math.round(doc.averageConsultationTimeMs / 60000),
      currentPatient: currentPatient ? { tokenId: currentPatient.tokenId, name: currentPatient.name } : null,
      queueTokens, // ordered list for public display
    };
  });

  return NextResponse.json({ success: true, doctors: doctorsList });
}
