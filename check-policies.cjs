require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.rpc('get_policies', { table_name: 'quiz_submissions' });
  console.log("Policies via RPC:", data, error);
  // manual SQL query using postgres meta or just selecting from pg_policies
  // We can't do raw sql easily through supabase js without RPC, wait, I can use psql if we had it, but we don't.
}
run();
