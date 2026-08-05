const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  console.log("Testing upload with anon key...");
  const dummyBuffer = Buffer.from('Hello world');
  const { data, error } = await supabase.storage.from('assignments').upload('test.txt', dummyBuffer, { upsert: true });
  if (error) {
    console.error("Upload failed with anon key:", error.message);
  } else {
    console.log("Upload succeeded with anon key!", data);
  }
}

testUpload();
