// إعدادات الاتصال بقاعدة بيانات Supabase
const SUPABASE_URL = 'ضع_رابط_مشروعك_هنا_مثل_https_xyz.supabase.co';
const SUPABASE_ANON_KEY = 'ضع_مفتاح_anon_الطويل_هنا';

// ربط الاتصال ليستخدمه باقي الملف
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
