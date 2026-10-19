import {buildTimeline} from './timeline.js';
import {createReport} from './report.js';
import {analyze} from './engine.js';
import {sample} from './samples.js';
import {parseTelemetry,toCSV} from './format.js';
const byId=(id:string)=>document.getElementById(id)!;
const examples=byId('examples');
let current=sample(1);
let lastFindings:ReturnType<typeof analyze>['findings']=[];
function renderFindings(){const list=byId('findings');list.replaceChildren();const filter=(byId('finding-filter') as HTMLSelectElement).value;const rule=(byId('rule-filter') as HTMLSelectElement).value;const shown=lastFindings.filter(f=>(filter==='ALL'||f.severity===filter)&&(rule==='ALL'||f.rule===rule));byId('finding-count').textContent=`${shown.length} / ${lastFindings.length} bulgu gösteriliyor`;for(const f of shown){const li=document.createElement('li');li.dataset.testid=`finding-${f.rule}`;li.textContent=`${f.rule} | t=${f.at}s | ${f.severity} | ${f.reason}`;list.append(li);}if(!lastFindings.length){const li=document.createElement('li');li.textContent='Tanımlı demo kurallarına göre bulgu yok.';list.append(li);}else if(!shown.length){const li=document.createElement('li');li.textContent='Bu filtrede bulgu yok.';list.append(li);}}
byId('finding-filter').addEventListener('change',renderFindings);
byId('rule-filter').addEventListener('change',renderFindings);
byId('reset-filters').addEventListener('click',()=>{(byId('finding-filter') as HTMLSelectElement).value='ALL';(byId('rule-filter') as HTMLSelectElement).value='ALL';renderFindings();});
const names=['Temiz uçuş','GPS sıçraması','İrtifa ayrışması','Sensör donması','Zaman geriye','Batarya çelişkisi','Yasak bölge','40 m/s sınır','Çoklu bulgu','Bozuk dosya'];
for(let i=1;i<=10;i++){const b=document.createElement('button');b.textContent=`L${i} · ${names[i-1]}`;b.dataset.testid=`sample-L${i}`;b.onclick=()=>{current=sample(i);byId('selected-scenario').textContent=`Seçili senaryo: L${i} · ${names[i-1]}`;show();};examples.append(b);}
function showInvalid(error:unknown){lastFindings=[];renderFindings();const status=byId('status');status.textContent='ANALİZ YAPILMADI';status.dataset.status='INVALID';byId('timeline').replaceChildren();byId('assessment').textContent='Değerlendirme yapılamadı.';byId('assessment').dataset.code='INVALID';byId('coverage').textContent='Gözlem kapsamı: veri geçersiz, değerlendirilemedi.';byId('coverage').dataset.complete='invalid';byId('error').textContent=error instanceof Error?error.message:String(error);byId('rule-evidence').replaceChildren();byId('report-json').setAttribute('disabled','');byId('download').setAttribute('disabled','');}
function show(){const status=byId('status'),findings=byId('findings');findings.replaceChildren();try{const result=analyze(current);const report=createReport(current,'selected-sample-or-upload');renderRuleEvidence(report);byId('report-json').removeAttribute('disabled');byId('download').removeAttribute('disabled');const coverage=byId('coverage');coverage.dataset.complete=String(report.coverage.complete);coverage.textContent=report.coverage.complete?'Gözlem kapsamı: zaman kesintisi tespit edilmedi. Bu, uçuş güvenliği onayı değildir.':`Gözlem kapsamı SINIRLI: ${report.coverage.interruptedIntervalCount} zaman kesintisi/hatası var. Kayıt dışı aralıklarda rota ve sensör davranışı bilinmiyor.`;status.textContent=result.status==='CLEAN'?'TEMİZ':result.status==='WARNING'?'DİKKAT':'KRİTİK';status.dataset.testid='overall-status';status.dataset.status=result.status;const assessment=byId('assessment');assessment.dataset.code=report.assessment.code;assessment.textContent=report.assessment.code==='INCOMPLETE'?'DEĞERLENDİRME EKSİK: Bulgu bulunmadı ancak veri boşlukları nedeniyle tam değerlendirme yapılamadı.':report.assessment.complete?'Gözlemlenen veri değerlendirildi; gerçek uçuş güvenliği onayı değildir.':'DEĞERLENDİRME KISMİ: Bulgular mevcut, ancak veri boşlukları nedeniyle tüm uçuş değerlendirilemedi.';lastFindings=result.findings;renderFindings();const timeline=byId('timeline');timeline.replaceChildren();for(const event of buildTimeline(current)){const li=document.createElement('li');li.dataset.testid=`timeline-${event.kind.toLowerCase()}`;li.textContent=`t=${event.at}s · ${event.kind} · ${event.rule}: ${event.description}`;timeline.append(li);}if(!timeline.childNodes.length){const li=document.createElement('li');li.textContent='Kayıt boşluğu veya bulgu yok.';timeline.append(li);}byId('error').textContent='';}catch(e){showInvalid(e);}}
byId('upload').addEventListener('change',async(e)=>{const f=(e.target as HTMLInputElement).files?.[0];if(!f)return;try{const ext=f.name.toLowerCase();if(!ext.endsWith('.csv')&&!ext.endsWith('.json'))throw Error('Yalnızca CSV veya JSON dosyası yüklenebilir.');const next=parseTelemetry(await f.text(),ext.endsWith('.json')?'json':'csv');analyze(next);current=next;byId('selected-scenario').textContent=`Yüklenen dosya: ${f.name}`;show();}catch(err){showInvalid(err);byId('selected-scenario').textContent=`Yükleme başarısız: ${f.name}`;(e.target as HTMLInputElement).value='';}});
byId('download').addEventListener('click',()=>{const blob=new Blob([toCSV(current)],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='flight-evidence-sample.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
show();

byId('report-json').addEventListener('click',()=>{
  try {
    const report=createReport(current,'selected-sample-or-upload');
    const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;
    a.download='flight-evidence-report.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    byId('error').textContent='';
  }catch(e){byId('error').textContent=e instanceof Error?e.message:String(e);}
});

function renderRuleEvidence(report:ReturnType<typeof createReport>){
 const container=byId('rule-evidence');container.replaceChildren();
 for(const rule of report.rules){
  const item=document.createElement('li');item.dataset.testid=`rule-${rule.rule}`;item.dataset.state=rule.state;
  const title=document.createElement('strong');title.textContent=`${rule.rule}: ${rule.state}`;item.append(title);
  const details=document.createElement('span');details.textContent=rule.reason?` · ${rule.at===null?'':`t=${rule.at}s · `}${rule.reason}`:' · Gözlemlenen veride eşik aşımı bulunmadı';item.append(details);
  const evidence=report.evidence.filter(e=>e.rule===rule.rule);
  for(const e of evidence){const metrics=document.createElement('div');metrics.dataset.testid=`metrics-${rule.rule}`;metrics.textContent=Object.entries(e.contextualMetrics).map(([k,v])=>`${k}: ${v}`).join(' · ')||'Sayısal eşik özeti mevcut değil';item.append(metrics);}
  for(const e of evidence){const source=document.createElement('div');source.dataset.testid=`source-rows-${rule.rule}`;source.textContent=`Kaynak kayıt (0 tabanlı): satır ${e.sourceRows.currentIndex ?? 'bilinmiyor'}`+(e.sourceRows.previousIndex===null?'':` · önceki satır ${e.sourceRows.previousIndex}`)+` · t=${e.at}s`;item.append(source);}
  container.append(item);
 }
}
