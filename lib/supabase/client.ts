import {createBrowserClient} from '@supabase/ssr';
import {connection} from './connection';
export const createClient=()=>{ const c=connection(); return createBrowserClient(c.url,c.key,{auth:c.auth}); };
