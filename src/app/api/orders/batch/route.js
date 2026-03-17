import { supabaseAdmin } from '@/supabase/supabaseClient';

function parseCookies(cookieHeader) {
  const result = {};
  if (!cookieHeader) return result;
  cookieHeader.split(';').forEach(c => {
    const parts = c.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=');
      result[key] = decodeURIComponent(value);
    }
  });
  return result;
}

function isUUID(str) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(str);
}

async function resolveCustomer(idOrName) {
  if (!idOrName) return null;
  if (isUUID(idOrName)) return idOrName;
  const { data } = await supabaseAdmin.from('customers').select('id').eq('name', idOrName).single();
  if (data) return data.id;
  const { data: newData, error } = await supabaseAdmin.from('customers').insert({ name: idOrName }).select('id').single();
  if (error) throw new Error("Failed to create customer: " + error.message);
  return newData.id;
}

async function resolveCompany(idOrName) {
  if (!idOrName) return null;
  if (isUUID(idOrName)) return idOrName;
  const { data } = await supabaseAdmin.from('companies').select('id').eq('name', idOrName).single();
  return data?.id || idOrName;
}

async function resolveRegion(idOrName) {
  if (!idOrName) return null;
  if (isUUID(idOrName)) return idOrName;
  const { data } = await supabaseAdmin.from('regions').select('id').eq('name', idOrName).single();
  if (data) return data.id;
  const { data: dataByCode } = await supabaseAdmin.from('regions').select('id').eq('code', idOrName).single();
  return dataByCode?.id || idOrName;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { orders, originCompanyId } = body;
    
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return new Response(JSON.stringify({ error: 'No orders provided or invalid data structure' }), { status: 400 });
    }

    const cookieHeader = req.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const sessionCompanyId = originCompanyId || cookies['company_id'];

    console.log("=== BATCH UPLOAD DIAGNOSTIC ===");
    console.log("Received originCompanyId from Body:", originCompanyId);
    console.log("Cookie Header:", cookieHeader);
    console.log("Parsed Cookies:", cookies);
    console.log("Final Resolved sessionCompanyId:", sessionCompanyId);
    console.log("===============================");

    if (!sessionCompanyId) {
      return new Response(JSON.stringify({ error: 'Origin Company ID is required from session.' }), { status: 401 });
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < orders.length; i++) {
        const row = orders[i];
        try {
            const customerIdRaw = row.customerId;
            const regionIdRaw = row.regionId;
            const destCompanyIdRaw = row.destinationCompanyId;
            const price = parseFloat(row.price || 0);

            // Resolve IDs smartly
            const resolvedCustomer = await resolveCustomer(customerIdRaw);
            const resolvedRegion = await resolveRegion(regionIdRaw);
            const resolvedDest = await resolveCompany(destCompanyIdRaw);
            const resolvedOrigin = await resolveCompany(sessionCompanyId);

            // Insert into orders
            const { data: orderData, error: orderError } = await supabaseAdmin
              .from('orders')
              .insert({
                customer_id: resolvedCustomer,
                origin_company_id: resolvedOrigin,
                destination_company_id: resolvedDest || null,
                region_id: resolvedRegion,
                price: price,
                status: 'PENDING'
              })
              .select('id')
              .single();

            if (orderError) throw new Error(orderError.message);

            // If item data exists in the same row, insert it
            if (row.productId && row.quantity && row.itemPrice) {
                 const { error: itemError } = await supabaseAdmin
                 .from('order_items')
                 .insert({
                   order_id: orderData.id,
                   product_id: isUUID(row.productId) ? row.productId : null, // Assuming product must be UUID, fallback to null if string for now
                   quantity: parseInt(row.quantity),
                   price: parseFloat(row.itemPrice)
                 });
                 if (itemError) throw new Error("Item insert failed: " + itemError.message);
            }
            
            results.push(orderData.id);
        } catch (err) {
            errors.push({ row: i + 1, message: err.message });
        }
    }

    if (errors.length > 0) {
         return new Response(JSON.stringify({ success: false, results, errors }), { status: 207 }); // 207 Multi-Status
    }

    return new Response(JSON.stringify({ success: true, count: results.length }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (e) {
    return new Response(JSON.stringify({ error: (e && e.message) || 'Unknown server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
