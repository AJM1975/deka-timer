const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const validId=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{8,100}$/.test(v);
const sha256=async text=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))).map(b=>b.toString(16).padStart(2,'0')).join('');
async function owner(request,env){
 const auth=request.headers.get('Authorization')||'';
 if(!auth.startsWith('Bearer '))return null;
 const token=auth.slice(7);if(token.length<32||token.length>512)return null;
 return env.DB.prepare("SELECT u.id,u.email,u.early_access FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>datetime('now')").bind(await sha256(token)).first();
}
async function payload(request){const size=Number(request.headers.get('content-length')||0);if(size>100000)return null;try{const raw=await request.text();return raw.length<=100000?JSON.parse(raw):null}catch{return null}}
export async function handleData(request,env,url){
 if(!env.DB)return json({error:'Storage unavailable'},503);
 const user=await owner(request,env);
 if(!user)return json({error:'Authentication required'},401);
 const method=request.method;
 if(url.pathname==='/api/me'&&method==='GET')return json({id:user.id,email:user.email,earlyAccess:!!user.early_access});
 if(url.pathname==='/api/athletes'&&method==='GET'){
  const rows=await env.DB.prepare('SELECT id,name,created_at,updated_at FROM athletes WHERE user_id=? AND deleted_at IS NULL ORDER BY created_at').bind(user.id).all();
  return json({athletes:rows.results});
 }
 if(url.pathname==='/api/athletes'&&method==='POST'){
  const b=await payload(request);if(!b||!validId(b.id)||typeof b.name!=='string'||!b.name.trim()||b.name.length>120)return json({error:'Invalid athlete'},400);
  await env.DB.prepare('INSERT OR IGNORE INTO athletes(id,user_id,name) VALUES(?,?,?)').bind(b.id,user.id,b.name.trim()).run();
  const row=await env.DB.prepare('SELECT id,name,created_at,updated_at FROM athletes WHERE id=? AND user_id=? AND deleted_at IS NULL').bind(b.id,user.id).first();
  return row?json({athlete:row},201):json({error:'Athlete ID conflict'},409);
 }
 const athleteMatch=url.pathname.match(/^\/api\/athletes\/([^/]+)$/);
 if(athleteMatch&&method==='DELETE'){
  const result=await env.DB.prepare("UPDATE athletes SET deleted_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=? AND deleted_at IS NULL").bind(athleteMatch[1],user.id).run();
  return json({deleted:result.meta.changes>0});
 }
 if(url.pathname==='/api/races'&&method==='GET'){
  const rows=await env.DB.prepare('SELECT id,athlete_id,client_id,revision,event_name,event_snapshot,started_at,finished_at,elapsed_ms,created_at,updated_at FROM races WHERE user_id=? AND deleted_at IS NULL ORDER BY updated_at DESC LIMIT 100').bind(user.id).all();
  return json({races:rows.results.map(r=>({...r,event_snapshot:JSON.parse(r.event_snapshot)}))});
 }
 const raceMatch=url.pathname.match(/^\/api\/races\/([^/]+)$/);
 if(raceMatch&&method==='PUT'){
  const id=raceMatch[1],b=await payload(request);
  if(!validId(id)||!b||!validId(b.clientId)||typeof b.eventName!=='string'||!b.eventName.trim()||b.eventName.length>200||!b.eventSnapshot||typeof b.eventSnapshot!=='object'||Array.isArray(b.eventSnapshot)||JSON.stringify(b.eventSnapshot).length>60000||!Number.isInteger(b.expectedRevision)||b.expectedRevision<0)return json({error:'Invalid race'},400);
  if(b.athleteId){const athlete=await env.DB.prepare('SELECT id FROM athletes WHERE id=? AND user_id=? AND deleted_at IS NULL').bind(b.athleteId,user.id).first();if(!athlete)return json({error:'Unknown athlete'},400)}
  const existing=await env.DB.prepare('SELECT revision,client_id FROM races WHERE id=? AND user_id=? AND deleted_at IS NULL').bind(id,user.id).first();
  if(existing){
   if(existing.client_id!==b.clientId||existing.revision!==b.expectedRevision)return json({error:'Revision conflict',revision:existing.revision},409);
   const result=await env.DB.prepare("UPDATE races SET athlete_id=?,revision=revision+1,event_name=?,event_snapshot=?,started_at=?,finished_at=?,elapsed_ms=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=? AND revision=? AND deleted_at IS NULL").bind(b.athleteId||null,b.eventName.trim(),JSON.stringify(b.eventSnapshot),b.startedAt||null,b.finishedAt||null,b.elapsedMs??null,id,user.id,b.expectedRevision).run();
   return result.meta.changes?json({id,revision:b.expectedRevision+1}):json({error:'Revision conflict'},409);
  }
  if(b.expectedRevision!==0)return json({error:'Revision conflict',revision:0},409);
  try{await env.DB.prepare('INSERT INTO races(id,user_id,athlete_id,client_id,event_name,event_snapshot,started_at,finished_at,elapsed_ms) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,user.id,b.athleteId||null,b.clientId,b.eventName.trim(),JSON.stringify(b.eventSnapshot),b.startedAt||null,b.finishedAt||null,b.elapsedMs??null).run();return json({id,revision:1},201)}catch{return json({error:'Race ID conflict'},409)}
 }
 if(raceMatch&&method==='DELETE'){
  const result=await env.DB.prepare("UPDATE races SET deleted_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=? AND deleted_at IS NULL").bind(raceMatch[1],user.id).run();
  return json({deleted:result.meta.changes>0});
 }
 return json({error:'Not found'},404);
}
