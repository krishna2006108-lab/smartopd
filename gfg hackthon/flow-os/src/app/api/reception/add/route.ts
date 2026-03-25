import { NextResponse } from "next/server";
import { addPatient } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { doctorId, name, phone } = await req.json();

    if (!doctorId || !name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const patient = addPatient(doctorId, name, phone);
    
    if (!patient) {
      return NextResponse.json({ error: "Invalid doctor selected" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      patientId: patient.id,
      tokenId: patient.tokenId,
      message: "Parcha generated successfully"
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
