import {readFile} from 'node:fs/promises';
import {renderPublishedPage} from '@/lib/lp-publication/render.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(_request:Request,context:{params:Promise<{id:string}>}){const {id}=await context.params;if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))return new Response('Not found',{status:404});const spec=JSON.parse(await readFile(process.cwd()+'/issued/lp100a.json','utf8'));return new Response(renderPublishedPage(spec,id,{tracking:process.env.LP_AD_TRACKING_ENABLED==='true'&&process.env.VERCEL_ENV==='production'}),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});}
