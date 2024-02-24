import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://gomhtyyltrqyoflqrgvy.supabase.co";
const supabaseKey = Deno.env.get("DATABASE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey!, {
    auth: { persistSession: false }
});

export default supabase;
