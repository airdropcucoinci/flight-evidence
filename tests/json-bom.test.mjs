import test from 'node:test';
import assert from 'node:assert/strict';
import {parseTelemetry} from '../dist/format.js';
const row={t:0,lat:39,lon:32,gpsAlt:50,baroAlt:50,ax:0,gx:0,motor:20,voltage:12};
test('JSON UTF-8 BOM is accepted without altering telemetry',()=>{
 const parsed=parseTelemetry('\uFEFF'+JSON.stringify([row]),'json');
 assert.deepEqual(parsed,[row]);
});
test('Malformed JSON with BOM is still rejected',()=>{
 assert.throws(()=>parseTelemetry('\uFEFF[{','json'),SyntaxError);
});
