import type {Point} from './engine.js';
export const FIELDS=['t','lat','lon','gpsAlt','baroAlt','ax','gx','motor','voltage'] as const;
function csvCells(line:string,rowNumber:number):string[]{
 const cells:string[]=[];let cell='';let quoted=false;let closed=false;
 for(let i=0;i<line.length;i++){
  const c=line[i];
  if(quoted){if(c==='"'){if(line[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else{cell+=c;}continue;}
  if(c===','){cells.push(cell.trim());cell='';closed=false;continue;}
  if(c==='"'){if(cell.trim()!==''||closed)throw Error(`CSV row ${rowNumber}: malformed quote`);quoted=true;continue;}
  if(closed && c.trim()!=='')throw Error(`CSV row ${rowNumber}: characters after closing quote`);
  cell+=c;
 }
 if(quoted)throw Error(`CSV row ${rowNumber}: unterminated quoted field`);
 cells.push(cell.trim());return cells;
}
// Split physical lines into logical CSV records, preserving newlines inside quoted fields.
// Quote-aware record splitting: a quote only opens a field at its beginning.
// This avoids swallowing later records when malformed quotes appear in bare fields.
function csvRecords(input:string):{text:string;line:number}[]{
 const records:{text:string;line:number}[]=[];
 let start=1,line=1,record='',inQuotes=false,atFieldStart=true,afterQuote=false;
 for(let i=0;i<input.length;i++){
  const c=input[i];
  if(c==='"'){
   if(inQuotes){
    if(input[i+1]==='"'){record+='""';i++;continue;}
    inQuotes=false;afterQuote=true;
   } else if(atFieldStart){inQuotes=true;atFieldStart=false;}
   // Unexpected quotes remain in the record and csvCells reports malformed quote.
   record+=c;continue;
  }
  if(c===',' && !inQuotes){record+=c;atFieldStart=true;afterQuote=false;continue;}
  if(c==='\r'||c==='\n'){
   const ending=c==='\r'&&input[i+1]==='\n'?'\r\n':c;
   if(ending.length===2)i++;
   if(inQuotes)record+='\n';
   else {records.push({text:record,line:start});record='';start=line+1;atFieldStart=true;afterQuote=false;}
   line++;continue;
  }
  if(!inQuotes && atFieldStart && c.trim()!=='')atFieldStart=false;
  if(!inQuotes && afterQuote && c.trim()!=='')afterQuote=false;
  record+=c;
 }
 if(inQuotes)throw Error(`CSV row ${start}: unterminated quoted field`);
 if(record!==''||records.length===0)records.push({text:record,line:start});
 return records;
}
export function parseTelemetry(input:string,kind:'csv'|'json'):Point[]{
 // Bound direct browser imports as well as API requests before parsing.
 if(new TextEncoder().encode(input).byteLength>1_048_576)throw Error('Telemetry input exceeds 1 MB demo limit');
 let data:unknown;
 if(kind==='json') {data=JSON.parse(input.replace(/^\uFEFF/,''));if(!Array.isArray(data))throw Error('JSON must contain an array of rows');}
 else {const records=csvRecords(input.replace(/^\uFEFF/,''));const headerRecord=records.shift();const header=csvCells(headerRecord?.text??'',headerRecord?.line??1);
 if(new Set(header).size!==header.length)throw Error('Duplicate CSV column names are not allowed');
 for(const field of FIELDS)if(!header.includes(field))throw Error(`Missing CSV column: ${field}`);
 data=records.filter(r=>r.text.trim()!=='').map(r=>{const parts=csvCells(r.text,r.line);if(parts.length!==header.length)throw Error(`CSV row ${r.line} has wrong column count`);return Object.fromEntries(header.map((k,j)=>[k,parts[j]]));});}
 if((data as unknown[]).length>5000)throw Error('Maximum 5000 telemetry rows allowed');
 return (data as Record<string,unknown>[]).map((r,i)=>{
 if(!r||typeof r!=='object'||Array.isArray(r))throw Error(`Invalid row ${i+1}`);
 const row={} as Point;
 for(const field of FIELDS){const value=r[field];if(value===null||value===undefined||typeof value==='boolean'||String(value).trim()==='')throw Error(`Row ${i+1}: missing ${field}`);
 const number=typeof value==='number'?value:(typeof value==='string' && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value.trim()) ? Number(value.trim()) : NaN);if(!Number.isFinite(number))throw Error(`Row ${i+1}: invalid ${field}`);row[field]=number;}
 return row;
 });
}
export function toCSV(rows:Point[]):string{return [FIELDS.join(','),...rows.map(r=>FIELDS.map(k=>r[k]).join(','))].join('\n');}
