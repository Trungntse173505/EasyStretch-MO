import { createClient } from '@supabase/supabase-js';
// Lấy URL và Key từ file .env mà bạn vừa tạo lúc nãy
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;
// Khởi tạo và xuất ra biến supabase để các file khác dùng chung
export const supabase = createClient(supabaseUrl, supabaseAnonKey);