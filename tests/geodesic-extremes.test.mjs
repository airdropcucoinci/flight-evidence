import {test} from 'node:test';
import assert from 'node:assert/strict';
import {distance,validate} from '../dist/engine.js';
import {sample} from '../dist/samples.js';

test('great-circle distance remains finite at antipodal and near-antipodal points',()=>{
  const a={...sample(1)[0],lat:0,lon:0};
  for(const [lat,lon] of [[0,180],[0.000001,179.999999],[-0.000001,-179.999999]]){
    const d=distance(a,{...a,lat,lon});
    assert.ok(Number.isFinite(d),`distance must be finite for ${lat},${lon}`);
    assert.ok(d>20_000_000 && d<20_100_000);
  }
});
test('invalid geographic coordinate ranges are rejected before analysis',()=>{
  for(const [field,value] of [['lat',90.0001],['lat',-90.0001],['lon',180.0001],['lon',-180.0001]]){
    const rows=sample(1);rows[0][field]=value;
    assert.ok(validate(rows).some(e=>e.includes('invalid coordinates')));
  }
});
