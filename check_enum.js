const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envOutput = fs.readFileSync('.env.local', 'utf8');
const env = {};
envOutput.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkEnum() {
  const { data, error } = await supabase.rpc('get_enum_values', { type_name: 'order_status' });
  if (error) {
    // If RPC doesn't exist, try raw query through a generic interface or just check another order
    const { data: orders } = await supabase.from('orders').select('status').limit(10);
    console.log('EXISTING_STATUSES:' + JSON.stringify([...new Set(orders.map(o => o.status))]));
  } else {
    console.log('ENUM_VALUES:' + JSON.stringify(data));
  }
}
checkEnum();
