export function submissionError(message,delivery='unknown'){const error=new Error(message);error.delivery=delivery;return error;}

// A failed transport must never be reported as a saved enquiry.
export async function leadApi(action,payload,{fetcher=globalThis.fetch,timeout=65000}={}){
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),timeout);
 try{
  const response=await fetcher('/api/leads.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload}),signal:controller.signal});
  if([403,404,405,413,429,503].includes(response.status))throw submissionError(response.status===429?'Online enquiries are temporarily busy. Your brief has not been sent.':'Online submission is unavailable. Your brief has not been sent.', 'not_sent');
  if(!(response.headers.get('content-type')||'').includes('application/json'))throw Error('The enquiry service is unavailable. Your submission has not been confirmed. Please email hadi@intellignce.net.');
  let result;try{result=await response.json()}catch{throw Error('Unable to confirm your submission. Please try again using this form.');}
  if(!response.ok||!result?.ok)throw submissionError(result?.error||'Your enquiry has not been confirmed. Please try again.',result?.delivery==='not_sent'?'not_sent':'unknown');
  if(action!=='availability'&&(typeof result.reference!=='string'||!result.reference))throw Error('Unable to confirm your submission reference. Please retry using this form.');
  if(action==='availability'&&!Array.isArray(result.slots))throw Error('Availability could not be confirmed. Please try another date.');
  return result;
 }catch(error){
  if(error.name==='AbortError'||error instanceof TypeError)throw Error('The connection was interrupted. Keep this form open and try again; the same reference prevents duplicate submissions.');
  throw error;
 }finally{clearTimeout(timer)}
}

// Optional AI never blocks the deterministic questionnaire or handles contact details.
export async function consultationAI(description,{fetcher=globalThis.fetch,timeout=18000}={}){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
 try{const response=await fetcher('/api/consultation.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({description:String(description).slice(0,1500)}),signal:controller.signal});if(!response.ok||!(response.headers.get('content-type')||'').includes('application/json'))throw Error('AI assistance unavailable');const result=await response.json();if(!result.ok||!Array.isArray(result.services)||typeof result.acknowledgment!=='string'||result.services.some(s=>!['branding','design','social','commerce','app','landing'].includes(s))||typeof result.business!=='string'||typeof result.audience!=='string')throw Error('AI assistance unavailable');return result;}finally{clearTimeout(timer)}
}

// Read-only readiness check. Never sends a lead or retries a pending request.
export async function checkLeadService({fetcher=globalThis.fetch,timeout=8000}={}){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
 try{const response=await fetcher('/api/leads.php',{method:'GET',cache:'no-store',signal:controller.signal});if([404,503].includes(response.status))return {status:'unavailable',delivery:'not_sent'};if(response.ok&&(response.headers.get('content-type')||'').includes('application/json')){const result=await response.json();if(typeof result.available==='boolean')return {status:result.available?'available':'unavailable',delivery:result.available?'unknown':'not_sent'};}return {status:'unknown',delivery:'unknown'};}catch{return {status:'unknown',delivery:'unknown'};}finally{clearTimeout(timer);}
}
