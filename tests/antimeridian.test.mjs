import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze} from '../dist/engine.js';
const base={gpsAlt:40,baroAlt:40,ax:0,gx:0,motor:10,voltage:12};
test('antimeridian crossing does not create a false R6 geofence finding',()=>{
 const rows=Array.from({length:10},(_,i)=>({...base,t:i,lat:39.003,lon:i%2? -179.999:179.999}));
 assert.equal(analyze(rows).findings.some(f=>f.rule==='R6'),false);
});
test('ordinary segment crossing demo polygon still produces R6',()=>{
 const rows=Array.from({length:10},(_,i)=>({...base,t:i,lat:39.003,lon:i%2?32.005:32.001}));
 assert.equal(analyze(rows).findings.some(f=>f.rule==='R6'),true);
});
