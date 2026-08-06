require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: user } = await supabase.from('profiles').select('id').limit(1).single();
  // find a valid quiz
  const { data: quiz } = await supabase.from('quizzes').select('id').limit(1).single();
  
  if (!user || !quiz) {
    console.log("missing user or quiz");
    return;
  }

  // same payload as actions.ts
  const payload = {
    quiz_id: quiz.id,
    student_id: user.id,
    score: 100,
    time_spent_seconds: 300
  };

  const { error } = await supabase.from('quiz_submissions').insert(payload);
  console.log("Insert with service role error:", error);

  // Now let's try inserting as the user themselves (bypassing service role to test RLS)
  const supabaseUser = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  // We can't easily sign in without password, but let's check if the table has unique constraints on quiz_id and student_id?
  const { data: cols, error: colErr } = await supabase.from('quiz_submissions').select('*').limit(1);
  console.log("Cols:", cols);
}
run();
