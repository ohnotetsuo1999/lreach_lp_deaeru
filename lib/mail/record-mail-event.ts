import 'server-only';
export type MailEventType='click'|'line_add'|'line_add_existing'|'line_block'|'pre_interview'|'sokyaku_reserved'|'sokyaku_seated';
export async function recordMailEventOnce(params:{campaignId:string;uid:string;type:MailEventType}):Promise<boolean>{
  const base=process.env.NEXT_PUBLIC_LREACH_BACKEND_URL;
  if(!base)return false;
  try {const result=await fetch(`${base.replace(/\/$/,'')}/api/mail/events/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(params),cache:'no-store'});return result.ok;}
  catch{return false;}
}
