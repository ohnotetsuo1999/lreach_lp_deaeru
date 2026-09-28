// 既存UUIDページとの互換性。管理キーは持たず、公開link_meta専用APIへ接続する。
import 'server-only';
import {type SupabaseClient} from '@supabase/supabase-js';
import {getSupabaseClient} from './supabaseClient';
export const supabaseAdmin = new Proxy({} as SupabaseClient,{get(_target,key){const client=getSupabaseClient();const value=client[key as keyof SupabaseClient];return typeof value==='function'?value.bind(client):value;}});
