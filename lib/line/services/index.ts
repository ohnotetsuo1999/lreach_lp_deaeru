import 'server-only';
import type {Message} from '@line/bot-sdk';
export async function sendPushToUser(payload:{userId:string;messages:Message[]}){
  const base=process.env.NEXT_PUBLIC_LREACH_BACKEND_URL;
  const token=process.env.LREACH_FRONTEND_TOKEN;
  if(!base||!token)throw new Error('Backend LINE integration is not configured');
  const response=await fetch(`${base.replace(/\/$/,'')}/api/lp/internal/line-push/`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(payload),cache:'no-store'});
  if(!response.ok)throw new Error('Backend LINE request failed');
}
