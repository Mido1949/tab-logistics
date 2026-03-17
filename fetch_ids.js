const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic env parsing since dotenv might not be in root
const envOutput = fs.readFileSync('.env.local', 'utf8');
const env = {};
envOutput.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function getIDs() {
  const { data, error } = await supabase.from('companies').select('id, name').limit(5);
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('COMPANIES_DATA:' + JSON.stringify(data));
  }
}
getIDs();
