import { createClient } from '@supabase/supabase-js';
import { IS_BOOK_PREVIEW } from '@/features/book/preview';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// 如果未配置 Supabase，返回 null（前端降级为纯静态模式）
export const supabase =
  !IS_BOOK_PREVIEW && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = Boolean(!IS_BOOK_PREVIEW && supabaseUrl && supabaseAnonKey);
