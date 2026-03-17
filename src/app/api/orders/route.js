import { supabaseAdmin } from '@/supabase/supabaseClient';

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = decodeURIComponent(parts.slice(1).join('='));
      list[key] = val;
    }
  });
  return list;
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
  if (error) return null;
  return newData.id;
}

async function resolveCompany(idOrName) {
  if (!idOrName) return null;
  if (isUUID(idOrName)) return idOrName;
  const { data } = await supabaseAdmin.from('companies').select('id').eq('name', idOrName).single();
  if (data) return data.id;
  const { data: idata } = await supabaseAdmin.from('companies').select('id').ilike('name', idOrName).single();
  if (idata) return idata.id;
  return null;
}

async function resolveRegion(idOrName) {
  if (!idOrName) return null;
  if (isUUID(idOrName)) return idOrName;
  // Try by name
  const { data } = await supabaseAdmin.from('regions').select('id').ilike('name', idOrName).single();
  if (data) return data.id;
  // Try by code
  const { data: dataByCode } = await supabaseAdmin.from('regions').select('id').ilike('code', idOrName).single();
  if (dataByCode) return dataByCode.id;
  // Auto-create region if not found
  const { data: newRegion, error } = await supabaseAdmin.from('regions').insert({ name: idOrName, code: idOrName }).select('id').single();
  if (error) return null;
  return newRegion.id;
}

async function resolveProduct(idOrName) {
  if (!idOrName) return null;
  if (isUUID(idOrName)) return idOrName;
  // Try find by name
  const { data } = await supabaseAdmin.from('products').select('id').ilike('name', idOrName).single();
  if (data) return data.id;
  // Auto-create product if not found
  const { data: newProduct, error } = await supabaseAdmin.from('products').insert({ name: idOrName }).select('id').single();
  if (error) return null;
  return newProduct.id;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      customerId, customerName,
      originCompanyId, originCompanyName,
      destinationCompanyId, destinationCompanyName,
      regionId, regionName,
      price, items, status = 'PENDING' 
    } = body;
    const cookieHeader = req.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    
    // Resolve IDs - handle both "Id" and "Name" keys for flexibility
    const resolvedCustomer = await resolveCustomer(customerId || customerName);
    const resolvedOrigin = await resolveCompany(originCompanyId || originCompanyName || cookies.company_id);
    const resolvedDest = await resolveCompany(destinationCompanyId || destinationCompanyName);
    const resolvedRegion = await resolveRegion(regionId || regionName);

    if (!resolvedOrigin) {
      return new Response(JSON.stringify({ error: 'Origin Company ID could not be resolved' }), { status: 400 });
    }

    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_id: resolvedCustomer,
        origin_company_id: resolvedOrigin,
        destination_company_id: resolvedDest,
        region_id: resolvedRegion,
        price,
        status: status
      })
      .select('id')
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.id;

    if (items && Array.isArray(items) && items.length > 0) {
      const itemsToInsert = [];
      for (const it of items) {
        const resolvedPid = await resolveProduct(it.product_id);
        if (resolvedPid) {
          itemsToInsert.push({
            order_id: orderId,
            product_id: resolvedPid,
            quantity: it.quantity,
            price: it.price
          });
        }
      }
      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabaseAdmin.from('order_items').insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }
    }

    return new Response(JSON.stringify({ success: true, order_id: orderId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const urlCompanyId = url.searchParams.get('company_id');
    const cookies = parseCookies(req.headers.get('cookie'));
    const rawId = urlCompanyId || cookies.company_id;

    if (!rawId) {
      return new Response(JSON.stringify({ error: 'company_id is required' }), { status: 400 });
    }

    const resolvedId = await resolveCompany(rawId);
    if (!resolvedId) {
      return new Response(JSON.stringify({ error: 'Could not resolve company_id', orders: [] }), { status: 200 });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('origin_company_id', resolvedId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return new Response(JSON.stringify({ orders: data ?? [] }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
