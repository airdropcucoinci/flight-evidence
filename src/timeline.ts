import {analyze, type Point} from './engine.js';
export type TimelineEvent={kind:'FINDING'|'DATA_GAP'|'TIME_ERROR';at:number;rule:string;severity:'WARNING'|'CRITICAL';description:string};
/** A gap is unknown trajectory, never a proven geofence crossing. */
export function buildTimeline(rows:Point[]):TimelineEvent[]{
  const result=analyze(rows);
  const events:TimelineEvent[]=result.findings.map(f=>({kind:'FINDING',at:f.at,rule:f.rule,severity:f.severity,description:f.reason}));
  for(let i=1;i<rows.length;i++){
    const dt=rows[i].t-rows[i-1].t;
    if(dt>5)events.push({kind:'DATA_GAP',at:rows[i].t,rule:'R4',severity:'WARNING',description:`No observations between ${rows[i-1].t}s and ${rows[i].t}s (${dt}s gap); route unknown`});
    else if(dt<=0)events.push({kind:'TIME_ERROR',at:rows[i].t,rule:'R4',severity:dt<0?'CRITICAL':'WARNING',description:dt<0?'Timestamp moved backwards':'Repeated timestamp'});
  }
  return events.sort((a,b)=>a.at-b.at || (a.kind==='FINDING'?-1:1));
}
