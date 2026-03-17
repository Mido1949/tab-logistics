import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function GET(req, { params }) {
  try {
    const { id: companyId } = await params;
    const { data: regions, error } = await supabaseAdmin
      .from('company_regions')
      .select('regions(*)')
      .eq('company_id', companyId);

    if (error) throw error;
    
    // Flatten the result
    const flattened = (regions ?? []).map(r => r.regions).filter(Boolean);
    
    return new Response(JSON.stringify({ regions: flattened }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

export async function POST(req, { params }) {
  try {
    const { id: companyId } = await params;
    const { regions } = await req.json(); // Array of region IDs

    if (!Array.isArray(regions)) {
      return new Response(JSON.stringify({ error: 'Regions must be an array' }), { status: 400 });
    }

    // 1. Delete existing coverage
    const { error: delError } = await supabaseAdmin
      .from('company_regions')
      .delete()
      .eq('company_id', companyId);

    if (delError) throw delError;

    // 2. Insert new coverage
    if (regions.length > 0) {
      const toInsert = regions.map(regId => ({
        company_id: companyId,
        region_id: regId
      }));
      const { error: insError } = await supabaseAdmin
        .from('company_regions')
        .insert(toInsert);

      if (insError) throw insError;
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
