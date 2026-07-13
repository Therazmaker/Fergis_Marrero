import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://byholbvgwimdftfbmmcd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KgkSV7zJYwLi_IcFfWlEjQ_sAAcchaE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
