// Add to the Apps Script project BOUND to your Leads Google Sheet. No API keys needed.
function onOpen(){SpreadsheetApp.getUi().createMenu('Flow Leads').addItem('Business control center','openControlCenter').addItem('Open lead workspace','openLeadsDesk').addToUi()}
function openLeadsDesk(){ccActor_();SpreadsheetApp.getUi().showModelessDialog(HtmlService.createHtmlOutputFromFile('LeadsDesk').setWidth(1100).setHeight(760),'Flow · Leads')}
function deskSheet_(){ccActor_();const sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');if(!sh)throw Error('Leads tab not found.');return sh}
function deskPlain_(v){return String(v==null?'':v).replace(/^'(?=[=+@\-\t\r])/,'')}
// Bounded, owner-workspace data only. Application roles are not customer isolation.
function getLeadsDeskData(){return getLeadsDeskPage({}).rows}
function getLeadsDeskPage(options={}){
 const sh=deskSheet_();ccFields_(options,['cursor','snapshotLastRow']);const actual=sh.getLastRow(),last=options.snapshotLastRow===undefined?actual:options.snapshotLastRow;
 if(!Number.isInteger(last)||last<0||last>actual)throw Error('ADMIN_PAGE_CHANGED');if(last<2){if(options.cursor!==undefined&&options.cursor!==last)throw Error('ADMIN_PAGE_INVALID');return {rows:[],nextCursor:null,snapshotLastRow:last,total:0}}const cursor=options.cursor===undefined?last:options.cursor;if(!Number.isInteger(cursor)||cursor<1||cursor>last||cursor===1&&last>1)throw Error('ADMIN_PAGE_INVALID');if(last<2)return {rows:[],nextCursor:null,snapshotLastRow:last,total:0};
 const count=Math.min(200,cursor-1),width=Math.min(sh.getLastColumn(),18),annotations=Object.create(null);
 for(const record of Object.values(ccLatest_(ccRows_()))){if(record.kind!=='crm'||record.status==='archived')continue;const old=annotations[record.data.reference];if(!old||record.updated>old.updated||record.updated===old.updated)annotations[record.data.reference]=record}
 const rows=sh.getRange(cursor-count+1,1,count,width).getDisplayValues().reverse().map(r=>{const crm=annotations[r[0]];return {reference:r[0],received:r[1],status:r[2],name:deskPlain_(r[3]),email:deskPlain_(r[4]),phone:deskPlain_(r[5]),company:deskPlain_(r[6]),services:deskPlain_(r[7]),notes:deskPlain_(r[9]),timezone:r[10]||'',call:r[11]||'',notification:r[14]||'',meet:r[16]||'',source:r[13]||'',stage:crm?.data.stage||'New',tags:crm?.data.tags||[],followUp:crm?.data.followUp||'',crmNotes:crm?.data.notes||'',crmRecordId:crm?.id||'crm-'+String(r[0]).slice(5).toLowerCase(),crmVersion:crm?.version||0}});
 const counts=Object.create(null);for(const r of rows){const key=r.email.trim().toLowerCase();if(key)counts[key]=(counts[key]||0)+1}for(const r of rows)r.possibleDuplicate=!!r.email&&counts[r.email.trim().toLowerCase()]>1;return {rows,nextCursor:cursor-count>1?cursor-count:null,snapshotLastRow:last,total:last-1};
}
function getLeadsDeskSession(){return ccToken_()}
function saveLeadsDeskAnnotation(command,token){
 ccGuard_(token);ccFields_(command,['reference','id','expectedVersion','stage','notes','tags','followUp','operationId']);
 if(!/^HADI-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(command.reference||''))throw Error('ADMIN_VALIDATION');
 const old=ccLatest_(ccRows_())[command.id];if(old&&(old.kind!=='crm'||old.data.reference!==command.reference)||!old&&command.id!=='crm-'+command.reference.slice(5).toLowerCase())throw Error('ADMIN_RECORD_MISMATCH');
 return saveControlCenter({id:command.id,kind:'crm',expectedVersion:command.expectedVersion,status:'draft',data:{reference:command.reference,stage:command.stage,notes:command.notes,tags:command.tags,followUp:command.followUp},operationId:command.operationId,confirm:false},token);
}
function exportLeadsDeskCSV(){
 const fields=['reference','received','status','name','email','phone','company','services','source','stage','followUp','tags'];
 const cell=v=>'"'+String(Array.isArray(v)?v.join('; '):v==null?'':v).replace(/^[\s]*[=+@\-\t\r]/,"'$&").replace(/"/g,'""')+'"';
 const rows=getLeadsDeskData();return {filename:'portfolio-leads.csv',scope:'latest_200',count:rows.length,csv:[fields.map(cell).join(','),...rows.map(r=>fields.map(k=>cell(r[k])).join(','))].join('\r\n')};
}
function getLeadsDeskBrief(reference){if(!/^HADI-[a-f0-9-]{36}$/i.test(reference||''))throw Error('Invalid reference.');const sh=deskSheet_(),found=sh.getRange('A:A').createTextFinder(reference).matchEntireCell(true).findNext();if(!found)throw Error('Lead not found.');const raw=deskPlain_(sh.getRange(found.getRow(),9).getValue());let data;try{data=JSON.parse(raw)}catch(e){return 'No structured brief is available.'}return JSON.stringify(data._consultation?.brief||data,null,2).slice(0,40000)}

