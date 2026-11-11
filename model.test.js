const test = require('node:test');
const assert = require('node:assert/strict');
const {overlapBounds,usableBreathBounds,evaluateCounts,wilson} = require('./model');
test('published marginals admit exactly the stated bounds',()=>{
  assert.deepEqual(overlapBounds(125,57,27,26),{minimum:0,maximum:27,technicalMin:0,technicalMax:27});
  assert.deepEqual(usableBreathBounds(125,27,26),[1,27]);
});
// Enumerate joint outcomes in small cohorts, without assuming assay independence.
test('intersection bounds agree with every possible four-person allocation',()=>{
  const pop=n=>n.toString(2).replaceAll('0','').length;
  const groups=new Map();
  for(let t=0;t<16;t++)for(let p=0;p<16;p++)for(let b=0;b<16;b++){
    const key=[pop(t),pop(p),pop(b)].join(',');
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(pop(t&p&~b));
  }
  for(const [key,values] of groups){
    const x=overlapBounds(4,...key.split(',').map(Number));
    assert.equal(x.technicalMin,Math.min(...values));
    assert.equal(x.technicalMax,Math.max(...values));
  }
});
test('additional yield retains unattempted and unevaluable cases',()=>{
  const x=evaluateCounts([100,45,50,40,8,5]);
  assert.equal(x.added,.05);assert.equal(x.conditional,5/55);assert.equal(x.totalResolved,.5);
  assert.ok(Math.abs(x.interval[0]-.02154)<.0001);
  assert.ok(Math.abs(x.interval[1]-.11175)<.0001);
});
test('empty conditional group and invalid nested counts',()=>{
  assert.equal(evaluateCounts([5,5,0,0,0,0]).conditional,null);
  assert.equal(wilson(0,0),null);
  for(const args of [[0,0,0,0,0,0],[5,4,2,1,1,1],[5,2,2,2,1,2],[5,2,2,2,1,NaN],[5,2,2,1.5,1,0]])
    assert.throws(()=>evaluateCounts(args));
});
