import { analyze, distance } from './engine.js';
import { buildTimeline } from './timeline.js';
export const RULES = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];
/** A deterministic evidence summary; does not claim attack attribution or flight safety. */
export function createReport(rows, source = 'synthetic-or-user-provided') {
    const result = analyze(rows);
    const timeline = buildTimeline(rows);
    const gaps = timeline.filter(event => event.kind === 'DATA_GAP');
    const timeErrors = timeline.filter(event => event.kind === 'TIME_ERROR');
    const interruptedIntervals = timeline.filter(event => event.kind === 'DATA_GAP' || event.kind === 'TIME_ERROR');
    const affectedRules = ['R1', 'R2', 'R3', 'R5', 'R6'];
    const rules = RULES.map(rule => {
        const finding = result.findings.find(f => f.rule === rule);
        const uncertain = !finding && interruptedIntervals.length > 0 && affectedRules.includes(rule);
        return { rule, state: (finding?.severity ?? (uncertain ? 'INDETERMINATE' : 'PASS')),
            at: finding?.at ?? null, reason: finding?.reason ?? (uncertain ? 'Kayıt kesintileri nedeniyle tüm uçuş boyunca değerlendirilemedi.' : null) };
    });
    const coverage = { complete: interruptedIntervals.length === 0, interruptedIntervalCount: interruptedIntervals.length, affectedRules, note: interruptedIntervals.length ? 'missing or invalid time intervals make affected checks indeterminate when no finding is present.' : 'PASS only means no finding under demo thresholds; not a real-world safety clearance.' };
    const evidence = result.findings.map(f => {
        const index = rows.findIndex(r => r.t === f.at);
        const current = index >= 0 ? rows[index] : null;
        const previous = index > 0 ? rows[index - 1] : null;
        const sourceRows = { currentIndex: index >= 0 ? index : null, previousIndex: index > 0 ? index - 1 : null, indexBase: 0 };
        const observed = current ? { timestamp: current.t, latitude: current.lat, longitude: current.lon, gpsAltitude: current.gpsAlt, barometricAltitude: current.baroAlt, motorCommandPercent: current.motor, voltage: current.voltage } : null;
        const contextualMetrics = {};
        if (current && previous && f.rule === 'R1' && current.t > previous.t) {
            contextualMetrics.estimatedSpeedMps = distance(previous, current) / (current.t - previous.t);
            contextualMetrics.demoThresholdMps = 40;
        }
        if (current && f.rule === 'R2') {
            contextualMetrics.absoluteAltitudeDifferenceM = Math.abs(current.gpsAlt - current.baroAlt);
            contextualMetrics.demoThresholdM = 30;
        }
        if (current && f.rule === 'R7') {
            contextualMetrics.barometricAltitudeM = current.baroAlt;
            contextualMetrics.demoThresholdM = 120;
        }
        return { rule: f.rule, severity: f.severity, at: f.at, explanation: f.reason, sourceRows, observation: observed, contextualMetrics, interpretation: 'Rule-based flag only; requires human review; no attack attribution.' };
    });
    const ruleCoverage = { R1: 'position/time samples', R2: 'GPS and barometric altitude', R3: 'IMU samples and position/time', R4: 'timestamps', R5: 'motor command and voltage', R6: 'recorded positions and continuous path segments', R7: 'barometric altitude' };
    const assessment = { code: result.status === 'CRITICAL' ? 'CRITICAL' : result.status === 'WARNING' ? 'WARNING' : interruptedIntervals.length ? 'INCOMPLETE' : 'CLEAN', complete: interruptedIntervals.length === 0, indeterminateRules: rules.filter(r => r.state === 'INDETERMINATE').map(r => r.rule), note: interruptedIntervals.length ? 'Data gaps prevent a complete assessment; findings, if any, remain visible.' : 'No missing time intervals detected; this is not a flight safety certification.' };
    return { schemaVersion: '1.0', assessment, source, disclaimer: 'Demo consistency checks only; not evidence of attack, malfunction, or legal liability.',
        rowCount: rows.length, firstTimestamp: rows[0].t, lastTimestamp: rows[rows.length - 1].t,
        status: result.status, findings: result.findings, evidence, rules, ruleCoverage, timeline, coverage,
        dataQuality: { gapCount: gaps.length, timeErrorCount: timeErrors.length,
            hasUnobservedIntervals: gaps.length > 0, hasUnreliableTimeIntervals: timeErrors.length > 0,
            interpretation: 'Gaps indicate missing observations, not a proven flight path.' } };
}
