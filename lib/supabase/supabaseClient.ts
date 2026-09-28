import {createClient, type SupabaseClient} from '@supabase/supabase-js';
import {connection} from './connection';
let client: SupabaseClient | null=null;
export function getSupabaseClient(){if(!client){const c=connection();client=createClient(c.url,c.key,{auth:c.auth});}return client;}
export {getSupabaseClient as supabaseClient};
