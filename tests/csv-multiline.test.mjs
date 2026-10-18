import test from 'node:test';
import assert from 'node:assert/strict';
import {parseTelemetry} from '../dist/format.js';
const header='t,lat,lon,gpsAlt,baroAlt,ax,gx,motor,voltage,note';
const numeric='0,39,32,100,100,0,0,50,12';
test('quoted multiline optional CSV field preserves logical row',()=>{
 const rows=parseTelemetry(`${header}\r\n${numeric},"first line\r\nsecond line"\r\n${numeric},"done"`,'csv');
 assert.equal(rows.length,2);assert.equal(rows[1].voltage,12);
});
test('unterminated multiline quote is rejected',()=>{
 assert.throws(()=>parseTelemetry(`${header}\n${numeric},"unfinished\nline`,'csv'),/unterminated quoted field/);
});
test('embedded newline in numeric field is rejected',()=>{
 assert.throws(()=>parseTelemetry(`${header}\n"0\n1",39,32,100,100,0,0,50,12,ok`,'csv'),/invalid t/);
});
test('unexpected quote inside bare numeric CSV field is rejected',()=>{
 assert.throws(()=>parseTelemetry(`${header}\n0,39,3"2,100,100,0,0,50,12,ok`,'csv'),/malformed quote/);
});
test('escaped quotes inside optional multiline field are accepted',()=>{
 const rows=parseTelemetry(`${header}\n${numeric},"a ""quoted""\nvalue"\n${numeric},done`,'csv');
 assert.equal(rows.length,2);
});
