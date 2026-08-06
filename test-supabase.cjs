require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: user } = await supabase.from('profiles').select('id').limit(1).single();
  const { data: quiz } = await supabase.from('quizzes').select('id').limit(1).single();

  if (!user || !quiz) {
    console.log("No user or quiz found.");
    return;
  }

  const { error } = await supabase.from('quiz_submissions').insert({
    quiz_id: quiz.id,
    student_id: user.id,
    score: 100,
    time_spent_seconds: 300
  });

  console.log("Error:", error);
}

run();
