require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: quiz, error } = await supabase.from('quizzes').select('*').eq('id', 'd067bb7f-1452-4395-8bad-e0b1173f1c05').single();
  console.log("Quiz:", quiz, "Error:", error);
}
run();
