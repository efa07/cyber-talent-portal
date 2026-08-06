require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const { data: profiles } = await supabase.from('profiles').select('id');
  
  for (const u of users.users) {
    if (!profiles.find(p => p.id === u.id)) {
      console.log("Fixing profile for", u.email);
      const role = u.user_metadata?.role || 'student';
      const full_name = u.user_metadata?.full_name || 'User';
      
      const { error } = await supabase.from('profiles').insert({
        id: u.id,
        full_name,
        role
      });
      if (error) console.log("Failed to insert profile:", error);
      else console.log("Success");
    }
  }
}
run();
