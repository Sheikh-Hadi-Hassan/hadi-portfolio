/* Deploy as a Google Apps Script Web App, execute as your Google account.
 * Run setup() once. Set API_KEY (random 32+ characters) in Script Properties.
 * The PHP proxy holds the same key outside the public web directory.
 */
const SETTINGS={calendar:'sheikh.hadi.hassan@gmail.com',emails:['hadi@intellignce.net','sheikh.hadi.hassan@gmail.com'],services:['branding','design','social','commerce','app','landing'],duration:30,horizon:60};
const HEADERS=['Reference','Received UTC','Status','Name','Email','Phone','Business / website','Services','Brief JSON','Notes','Visitor timezone','Call start UTC','Calendar event ID','Source','Notification status'];
function setup(){
 const props=PropertiesService.getScriptProperties();
 let id=props.getProperty('SHEET_ID');
 if(!id){const ss=SpreadsheetApp.create('Hadi Hassan — Website Leads');id=ss.getId();props.setProperty('SHEET_ID',id)}
 const ss=SpreadsheetApp.openById(id);let sheet=ss.getSheetByName('Leads');if(!sheet)sheet=ss.insertSheet('Leads');
 if(sheet.getLastRow()===0){sheet.appendRow(HEADERS);sheet.setFrozenRows(1);sheet.getRange(1,1,1,HEADERS.length).setFontWeight('bold').setBackground('#27143f').setFontColor('#ffffff');sheet.setColumnWidths(1,HEADERS.length,160);sheet.setColumnWidth(9,400)}
 console.log(ss.getUrl());return ss.getUrl();
}
function doPost(e){try{
 const p=JSON.parse(e.postData.contents||'{}'),key=PropertiesService.getScriptProperties().getProperty('API_KEY');
 if(!key||key.length<32||p.key!==key)throw Error('Unauthorized request.');
 if(p.action==='availability')return output_(available_(p));
 if(!['enquiry','booking'].includes(p.action))throw Error('Unknown request.');
 validate_(p);
 const lock=LockService.getScriptLock();if(!lock.tryLock(20000))throw Error('Please try again in a moment.');
 try{return output_(save_(p))}finally{lock.releaseLock()}
}catch(error){return output_({ok:false,error:error.message||'Unable to complete this request.'})}}
function output_(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)}
function validate_(p){
 if(p.website)throw Error('Unable to accept this request.');
 if(typeof p.name!=='string'||!p.name.trim()||p.name.length>120||typeof p.email!=='string'||!p.email||p.email.length>180||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)||typeof p.phone!=='string'||p.phone.length>40)throw Error('Enter a valid name, email and phone number.');
 if(!Array.isArray(p.services)||!p.services.length||p.services.some(s=>!SETTINGS.services.includes(s)))throw Error('Select a valid service.');
 if(p.answers?._consultation?.brief?.preferredContact==='WhatsApp'&&!/^\+?[\d\s().-]{7,40}$/.test(p.phone||''))throw Error('Include a WhatsApp number and country code.');
 if(!/^[a-f0-9-]{36}$/i.test(p.requestId||''))throw Error('Invalid enquiry reference.');
 if(JSON.stringify(p.answers||{}).length>40000||(p.notes||'').length>3000||(p.company||'').length>200)throw Error('Please shorten your project details.');
}
function busy_(start,end){const data=Calendar.Freebusy.query({timeMin:start.toISOString(),timeMax:end.toISOString(),items:[{id:SETTINGS.calendar}]});const c=data.calendars&&data.calendars[SETTINGS.calendar];if(!c||c.errors)throw Error('Calendar availability cannot be checked right now. Please try again later.');return c.busy||[]}
function withinHours_(start){const date=Utilities.formatDate(start,'Asia/Karachi','yyyy-MM-dd'),day=new Date(date+'T00:00:00Z').getUTCDay(),clock=Utilities.formatDate(start,'Asia/Karachi','HH:mm').split(':').map(Number),minutes=clock[0]*60+clock[1];return day>=1&&day<=5&&minutes>=720&&minutes+SETTINGS.duration<=1260;}
function available_(p){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(p.date||''))throw Error('Choose a valid date.');
 const zone=p.timezone||'Asia/Karachi';try{Utilities.formatDate(new Date(),zone,'yyyy-MM-dd')}catch(e){throw Error('Invalid time zone.')}
 const date=new Date(p.date+'T00:00:00Z');if(!Number.isFinite(+date)||date.toISOString().slice(0,10)!==p.date||+date<Date.now()-86400000||+date>Date.now()+SETTINGS.horizon*86400000)throw Error('Choose a date in the next 60 days.');
 const start=new Date(+date-14*3600000),end=new Date(+date+38*3600000),busy=busy_(start,end),slots=[];
 // Walk UTC instants, then filter by visitor-local date. Handles DST without guessing offsets.
 for(let t=+start;t+1800000<=+end;t+=900000){const d=new Date(t);if(!withinHours_(d)||t<Date.now()+1800000||Utilities.formatDate(d,zone,'yyyy-MM-dd')!==p.date||!['00','30'].includes(Utilities.formatDate(d,zone,'mm')))continue;if(busy.some(b=>t<Date.parse(b.end)&&t+1800000>Date.parse(b.start)))continue;slots.push({start:d.toISOString()})}
 return {ok:true,slots};
}
function safe_(v){const s=String(v==null?'':v);return /^[=+@\-\t\r]/.test(s)?"'"+s:s}
function save_(p){
 const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');if(!id)throw Error('Enquiries are not configured yet.');
 const sheet=SpreadsheetApp.openById(id).getSheetByName('Leads');if(!sheet)throw Error('Enquiries are not configured yet.');
 const ref='HADI-'+p.requestId,found=sheet.getRange('A:A').createTextFinder(ref).matchEntireCell(true).findNext();
 let row=found?.getRow();let existing=row?sheet.getRange(row,1,1,HEADERS.length).getValues()[0]:null;
 if(existing&&['Received','Booked'].includes(existing[2]))return {ok:true,reference:ref,booking:existing[2]==='Booked'};
 if(existing&&existing[2]==='Slot unavailable')throw Error('That time was just booked. Choose another slot.');
 let event;
 if(p.action==='booking'){
  const start=new Date(p.slot),end=new Date(+start+1800000);
  if(!Number.isFinite(+start)||!withinHours_(start)||+start<Date.now()+1800000||+start>Date.now()+SETTINGS.horizon*86400000||!['00','30'].includes(Utilities.formatDate(start,p.timezone||'Asia/Karachi','mm'))||start.getUTCSeconds()!==0)throw Error('Choose a valid future slot.');
  // Deterministic event ID makes retries safe if Calendar succeeds but the response is interrupted.
  const eventId='hadi'+p.requestId.replace(/-/g,'').toLowerCase();
  try{event=Calendar.Events.get(SETTINGS.calendar,eventId)}catch(e){if(!/404|not found/i.test(String(e)))throw e}
  if(!event){if(busy_(start,end).some(b=>+start<Date.parse(b.end)&&+end>Date.parse(b.start)))throw Error('That time was just booked. Choose another slot.');}
 }
 if(!row){sheet.appendRow([ref,new Date().toISOString(),'Pending',safe_(p.name),safe_(p.email),safe_(p.phone),safe_(p.company),safe_(p.services.join(', ')),safe_(JSON.stringify(p.answers||{})),safe_(p.notes),safe_(p.timezone),safe_(p.slot||''),'',safe_(p.source||'/'),'Pending']);row=sheet.getLastRow();SpreadsheetApp.flush()}
 if(p.action==='booking'&&!event){
  // A final conflict check under the script lock protects concurrent form submissions.
  const start=new Date(p.slot),end=new Date(+start+1800000);
  if(busy_(start,end).some(b=>+start<Date.parse(b.end)&&+end>Date.parse(b.start))){sheet.getRange(row,3).setValue('Slot unavailable');throw Error('That time was just booked. Choose another slot.');}
  event=Calendar.Events.insert({id:'hadi'+p.requestId.replace(/-/g,'').toLowerCase(),summary:'Project discovery call — '+p.name,description:'Topic: '+(p.overview||'Project discovery')+'\nServices: '+p.services.join(', ')+'\nBusiness: '+(p.company||'')+'\nLead reference: '+ref,start:{dateTime:start.toISOString()},end:{dateTime:end.toISOString()},attendees:[{email:p.email}],guestsCanModify:false,guestsCanInviteOthers:false,conferenceData:{createRequest:{requestId:p.requestId,conferenceSolutionKey:{type:'hangoutsMeet'}}}},SETTINGS.calendar,{sendUpdates:'all',conferenceDataVersion:1});
 }
 sheet.getRange(row,3).setValue(event?'Booked':'Received');if(event)sheet.getRange(row,13).setValue(event.id);SpreadsheetApp.flush();
 try{MailApp.sendEmail({to:SETTINGS.emails.join(','),replyTo:p.email,subject:(event?'Call booked':'New project enquiry')+' — '+p.name,body:'Reference: '+ref+'\nName: '+p.name+'\nEmail: '+p.email+'\nPhone: '+p.phone+'\nBusiness: '+(p.company||'')+'\nServices: '+p.services.join(', ')+'\nTime zone: '+p.timezone+'\nCall: '+(p.slot||'Not requested')+'\nNotes: '+(p.notes||'')+'\n\nBrief:\n'+JSON.stringify(p.answers||{},null,2)+'\n\nSheet: '+sheet.getParent().getUrl()});sheet.getRange(row,15).setValue('Sent')}catch(e){sheet.getRange(row,15).setValue('Retry needed');}
 return {ok:true,reference:ref,booking:!!event};
}
function retryNotifications(){
 const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID'),sheet=SpreadsheetApp.openById(id).getSheetByName('Leads'),rows=sheet.getDataRange().getValues();
 for(let i=1;i<rows.length;i++){const r=rows[i];if(['Received','Booked'].includes(r[2])&&r[14]!=='Sent'){MailApp.sendEmail({to:SETTINGS.emails.join(','),subject:'Website lead notification — '+r[0],body:HEADERS.map((h,j)=>h+': '+r[j]).join('\n')});sheet.getRange(i+1,15).setValue('Sent')}}
}
