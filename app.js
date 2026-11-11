const el = id => document.getElementById(id);
const cohort = {total:125, failures:{Tissue:57, Plasma:27, 'Exhaled breath condensate':26}};
const limits = overlapBounds(cohort.total, ...Object.values(cohort.failures));
for (const [sample, failures] of Object.entries(cohort.failures)) {
  const percentage = failures/cohort.total*100;
  el('bars').insertAdjacentHTML('beforeend', '<div class="barname"><span>'+sample+'</span><b>'+failures+'/125 · '+percentage.toFixed(1)+'%</b></div><div class="track"><div class="fill" style="width:'+percentage+'%"></div></div>');
}
const slider = el('overlap');
slider.min = limits.minimum;
slider.max = limits.maximum;
function drawOverlap() {
  el('selected').textContent = slider.value;
  el('bound').textContent = usableBreathBounds(cohort.total,Number(slider.value),26).join('–');
}
slider.oninput = drawOverlap;
drawOverlap();
const labels = ['All eligible participants','Standard pathway found an actionable target','Breath attempted among remaining participants','Breath assay evaluable','New prespecified target detected in breath','New target independently confirmed'];
const example = [100,45,50,40,8,5];
const fields = labels.map((label,i) => {
  const row = document.createElement('label');
  row.className='field'; row.textContent=label;
  const field=document.createElement('input');
  field.type='number';field.min=0;field.max=1000000;field.step=1;field.value=example[i];
  row.append(field);el('inputs').append(row);
  return field;
});
function percent(fraction) {return fraction === null ? 'Undefined' : (100*fraction).toFixed(1)+'%';}
function render() {
  const result=el('result');
  try {
    const x=evaluateCounts(fields.map(f=>f.valueAsNumber));
    const ci=x.interval.map(percent).join(' to ');
    result.innerHTML='<strong class="number">'+percent(x.added)+'</strong><p>'+x.confirmed+' additional people / '+x.eligible+' eligible</p><small>95% Wilson interval '+ci+'</small><p class="rule">Among '+x.unresolved+' without a standard-pathway target: <b>'+percent(x.conditional)+'</b></p><p>Combined pathway yield: '+percent(x.totalResolved)+'</p><p>Breath not attempted: '+(x.unresolved-x.attempted)+'<br>Attempted but unevaluable: '+(x.attempted-x.evaluable)+'<br>Candidate without confirmation: '+(x.candidate-x.confirmed)+'</p>';
    el('export').disabled=false;
  } catch(error) { result.textContent=error.message; el('export').disabled=true; }
}
el('inputs').oninput=render;
el('inputs').onsubmit=e=>e.preventDefault();
el('reset').onclick=()=>{fields.forEach((f,i)=>f.value=example[i]);render();};
el('export').onclick=()=>{
  const rows=labels.map((name,i)=>name+': '+fields[i].value);
  const report=['Breath Yield | aggregate worksheet','Example or user-entered counts. Independent research prototype. No Respiro performance data.',...rows,'',el('result').innerText,'','Endpoint: first independently confirmed, prespecified actionable finding added by breath within a fixed paired testing window. Includes all eligible people in the primary denominator.','External reference: https://pubmed.ncbi.nlm.nih.gov/35526313/'].join('\n');
  const url=URL.createObjectURL(new Blob([report],{type:'text/plain'}));
  const a=document.createElement('a');a.href=url;a.download='paired-yield-analysis.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
render();
