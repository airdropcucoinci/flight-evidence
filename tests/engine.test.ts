import {it,expect} from 'vitest';
import {analyze,validate,distance} from '../src/engine';
import {sample} from '../src/samples';
import {parseTelemetry,toCSV} from '../src/format';
it('L1 clean',()=>expect(analyze(sample(1)).status).toBe('CLEAN'));
for(const [id,rule] of [[2,'R1'],[3,'R2'],[4,'R3'],[5,'R4'],[6,'R5'],[7,'R6'],[9,'R1']] as const)
 it(`L${id} triggers ${rule}`,()=>expect(analyze(sample(id)).findings.some(f=>f.rule===rule)).toBe(true));
it('L8 near 40 m/s boundary is clean',()=>expect(analyze(sample(8)).status).toBe('CLEAN'));
it('L9 includes three rule codes',()=>expect(['R1','R3','R6'].every(r=>analyze(sample(9)).findings.some(f=>f.rule===r))).toBe(true));
it('L10 invalid',()=>expect(validate(sample(10)).length).toBeGreaterThan(0));
it('R7 altitude',()=>{const x=sample(1);x[30].baroAlt=130;expect(analyze(x).findings.some(f=>f.rule==='R7')).toBe(true)});
it('CSV roundtrip',()=>expect(parseTelemetry(toCSV(sample(1)),'csv')).toEqual(sample(1)));
it('JSON roundtrip',()=>expect(parseTelemetry(JSON.stringify(sample(1)),'json')).toEqual(sample(1)));
it('Reject blank CSV numeric fields',()=>expect(()=>parseTelemetry('t,lat,lon,gpsAlt,baroAlt,ax,gx,motor,voltage\n1,,2,3,4,5,6,7,8','csv')).toThrow());
it('Reject missing coordinates without crashing',()=>{const x=sample(1);x[4]={...x[4],lat:NaN};expect(validate(x).length).toBeGreaterThan(0)});
it('Geodesic distance symmetry',()=>{const x=sample(1);expect(distance(x[1],x[2])).toBeCloseTo(distance(x[2],x[1]),7)});
