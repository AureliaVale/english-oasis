// إعدادات الاتصال بقاعدة بيانات Supabase
const SUPABASE_URL = 'https://vzkaguuozbetiklhafkb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6a2FndXVvemJldGlrbGhhZmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMjU4NjUsImV4cCI6MjEwNDkwMTg2NX0.HJ-3FWy2EWy14f5yeakf05uO9oLPkQwCG-FIfEbvc7Q';

// ربط الاتصال ليستخدمه باقي الملف
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
