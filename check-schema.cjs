require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'quiz_submissions' });
  console.log("RPC Error:", error);
  // Alternative: try to insert a record with only id and see what required columns are missing
  const { error: insertError } = await supabase.from('quiz_submissions').insert({ id: '00000000-0000-0000-0000-000000000000' });
  console.log("Insert missing columns error:", insertError);
}
run();
