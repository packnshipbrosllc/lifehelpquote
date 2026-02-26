import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const lead = await request.json();

    const { error } = await supabase.from('leads').insert({
      lead_id: lead.lead_id,
      timestamp: lead.timestamp,
      source: lead.source,
      first_name: lead.contact.first_name,
      last_name: lead.contact.last_name,
      phone: lead.contact.phone,
      email: lead.contact.email,
      age: lead.profile.age,
      health_status: lead.profile.health_status,
      timeline: lead.profile.timeline,
      budget: lead.profile.budget,
      need: lead.profile.need,
      recommended_product: lead.profile.recommended_product,
      tcpa_consent: lead.consent.tcpa_consent,
      consent_text: lead.consent.consent_text,
      consent_timestamp: lead.consent.timestamp,
      form_url: lead.consent.form_url,
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    console.log('LEAD SAVED:', lead.lead_id);
    return NextResponse.json({ success: true, lead_id: lead.lead_id });
  } catch (err) {
    console.error('Lead capture error:', err);
    return NextResponse.json({ success: false, error: 'Failed to capture lead' }, { status: 500 });
  }
}
