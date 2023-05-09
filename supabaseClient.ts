import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supabaseUrl = "https://gomhtyyltrqyoflqrgvy.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Logged into Supabase Successfully");
export default supabase;
