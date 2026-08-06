require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: users, error: uErr } = await supabase.auth.admin.listUsers();
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*');
  
  console.log("Users without profile:");
  users.users.forEach(u => {
    if (!profiles.find(p => p.id === u.id)) {
      console.log(u.id, u.email);
    }
  });
}
run();
