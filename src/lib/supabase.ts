import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjsooexrohigahdqjqkp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqc29vZXhyb2hpZ2FoZHFqcWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzE1NDAsImV4cCI6MjA3OTAwNzU0MH0.8prXQQgZvaxWjrZxsBOMzbh2--ySqjpFvV4gEu_P0_0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
