
import { createClient } from "@supabase/supabase-js"; 
import  Constants  from "expo-constants";

const supabaseURl = Constants?.expoConfig?.extra?.supabaseURl;
const supabaseAnonKey = Constants?.expoConfig?.extra?.supabaseAnonKey;

export const supabase = createClient(supabaseURl, supabaseAnonKey);