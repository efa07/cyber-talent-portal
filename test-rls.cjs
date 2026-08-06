require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function run() {
  const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  // Find a student
  const { data: student } = await adminClient.from('profiles').select('id, role').eq('role', 'student').limit(1).single();
  
  if (!student) {
    console.log("No student found");
    return;
  }
  
  // We can't log in as student without password, but we can bypass login by manually creating a client with their JWT?
  // Easier: temporarily alter a policy or just create a user with a known password.
  const { data: newUser, error: signUpError } = await adminClient.auth.admin.createUser({
    email: 'test' + Date.now() + '@example.com',
    password: 'password123',
    email_confirm: true,
  });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  await supabase.auth.signInWithPassword({
    email: newUser.user.email,
    password: 'password123'
  });

  const { data: userAuth } = await supabase.auth.getUser();
  console.log("Logged in as:", userAuth.user.id);

  // find a quiz
  const { data: quiz } = await adminClient.from('quizzes').select('id').limit(1).single();

  const { error: insertError } = await supabase.from('quiz_submissions').insert({
    quiz_id: quiz.id,
    student_id: userAuth.user.id,
    score: 100,
    time_spent_seconds: 300
  });

  console.log("Insert as authenticated user error:", insertError);
}
run();
