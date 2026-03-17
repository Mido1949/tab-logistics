import { supabaseAdmin } from '@/supabase/supabaseClient';

// GET /api/orders/match/[orderId]
// Returns top 3 partner matches for the given order
export async function GET(req, { params }) {
  const resolvedParams = await params;
  const orderId = resolvedParams?.id || resolvedParams?.orderId; // Support both naming conventions
  if (!orderId) {
    return new Response(JSON.stringify({ error: 'orderId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // 1) fetch the order to know the region
  const { data: order, error: orderErr } = await supabaseAdmin.from('orders').select('region_id').eq('id', orderId).single();
  if (orderErr || !order) {
    return new Response(JSON.stringify({ error: 'Order not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const regionId = order.region_id;

  // 2) get all companies covering this region
  const { data: regionMatches, error: regErr } = await supabaseAdmin.from('company_regions').select('company_id').eq('region_id', regionId);
  if (regErr) {
    return new Response(JSON.stringify({ error: regErr.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const candidateIds = (regionMatches || []).map((r) => r.company_id);
  if (!candidateIds.length) {
    return new Response(JSON.stringify({ orderId, matches: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 3) fetch candidate company details
  const { data: companies, error: compErr } = await supabaseAdmin.from('companies')
    .select('id, name, score, total_orders, verification_status')
    .in('id', candidateIds);
  if (compErr) {
    return new Response(JSON.stringify({ error: compErr.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 4) score calculation (higher is better)
  const matches = (companies || []).map((c) => {
    const base = (c.score || 0) * 10;
    const capacityBoost = Math.max(0, 1000 - (c.total_orders ?? 0)); // lower total_orders -> higher boost
    const verificationBoost = (c.verification_status === 'VERIFIED') ? 500 : 0; // +500 point boost for verified companies
    const matchScore = Math.round(base + capacityBoost + verificationBoost);
    return {
      id: c.id,
      name: c.name,
      score: c.score,
      total_orders: c.total_orders,
      verification_status: c.verification_status,
      region_match: true,
      matchScore
    };
  });

  // 5) sort and limit to top 3
  matches.sort((a, b) => b.matchScore - a.matchScore);
  const top3 = matches.slice(0, 3);

  return new Response(JSON.stringify({ orderId, matches: top3 }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
