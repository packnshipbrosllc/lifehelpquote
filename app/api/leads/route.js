import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const lead = await request.json();

    // Log lead to server console (visible in Vercel logs)
    console.log("=== NEW LEAD ===");
    console.log(JSON.stringify(lead, null, 2));
    console.log("================");

    // ---- WEBHOOK: Uncomment to forward leads in real-time ----
    // await fetch("https://your-webhook-url.com/api/leads", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(lead),
    // });

    // ---- SUPABASE: Uncomment to store in database ----
    // import { createClient } from "@supabase/supabase-js";
    // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    // await supabase.from("leads").insert(lead);

    return NextResponse.json({ success: true, lead_id: lead.lead_id });
  } catch (err) {
    console.error("Lead capture error:", err);
    return NextResponse.json({ success: false, error: "Failed to capture lead" }, { status: 500 });
  }
}
