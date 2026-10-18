import test from 'node:test';
import assert from 'node:assert/strict';
import {parseTelemetry,FIELDS} from '../dist/format.js';
const head=FIELDS.join(',');
const row='0,39,32,100,100,0,0,50,12';
test('quoted numeric CSV cells parse',()=>{
 const quoted='"0","39","32","100","100","0","0","50","12"';
 assert.deepEqual(parseTelemetry(`${head}\n${quoted}`,'csv'),parseTelemetry(`${head}\n${row}`,'csv'));
});
test('unterminated quote rejected',()=>assert.throws(()=>parseTelemetry(`${head}\n"0,39,32,100,100,0,0,50,12`,'csv'),/unterminated quoted field/));
test('malformed trailing characters after quote rejected',()=>assert.throws(()=>parseTelemetry(`${head}\n"0"x,39,32,100,100,0,0,50,12`,'csv'),/characters after closing quote/));
