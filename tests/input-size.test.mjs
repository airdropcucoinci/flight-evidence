import test from 'node:test';
import assert from 'node:assert/strict';
import {parseTelemetry} from '../dist/format.js';
test('reject oversized JSON before parsing',()=>{
 assert.throws(()=>parseTelemetry(' '.repeat(1_048_577),'json'),/1 MB demo limit/);
});
test('reject oversized CSV before parsing',()=>{
 assert.throws(()=>parseTelemetry(' '.repeat(1_048_577),'csv'),/1 MB demo limit/);
});
test('count UTF-8 bytes, not JavaScript characters',()=>{
 assert.throws(()=>parseTelemetry('ğ'.repeat(524_289),'json'),/1 MB demo limit/);
});
