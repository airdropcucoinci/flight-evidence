const radians = (v) => v * Math.PI / 180;
export function distance(a, b) { const dlat = radians(b.lat - a.lat), dlon = radians(b.lon - a.lon); const x = Math.sin(dlat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dlon / 2) ** 2; return 12742000 * Math.atan2(Math.sqrt(Math.min(1, Math.max(0, x))), Math.sqrt(1 - Math.min(1, Math.max(0, x)))); }
export function validate(rows) { const errors = []; if (!Array.isArray(rows) || rows.length < 10)
    return ['Minimum 10 rows required']; if (rows.length > 5000)
    return ['Maximum 5000 rows allowed for the public demo']; for (let i = 0; i < rows.length; i++) {
    for (const k of ['t', 'lat', 'lon', 'gpsAlt', 'baroAlt', 'ax', 'gx', 'motor', 'voltage'])
        if (!Number.isFinite(rows[i]?.[k]))
            errors.push(`Row ${i + 1}: invalid ${k}`);
    if (Number.isFinite(rows[i]?.lat) && Number.isFinite(rows[i]?.lon) && (Math.abs(rows[i].lat) > 90 || Math.abs(rows[i].lon) > 180))
        errors.push(`Row ${i + 1}: invalid coordinates`);
    if (Number.isFinite(rows[i]?.motor) && (rows[i].motor < 0 || rows[i].motor > 100))
        errors.push(`Row ${i + 1}: motor must be 0..100`);
    if (Number.isFinite(rows[i]?.voltage) && rows[i].voltage < 0)
        errors.push(`Row ${i + 1}: voltage must be non-negative`);
} return errors; }
const box = { minLat: 39.002, maxLat: 39.004, minLon: 32.002, maxLon: 32.004 };
function inside(p) { return p.lat >= box.minLat && p.lat <= box.maxLat && p.lon >= box.minLon && p.lon <= box.maxLon; }
function intersects(a, b) { let low = 0, high = 1; /* Unwrap longitude across the antimeridian: 179 to -179 is a 2-degree segment, not a 358-degree segment. */ /* Unwrap longitude across the antimeridian: 179 to -179 is a 2-degree segment, not a 358-degree segment. */ const lonDelta = ((b.lon - a.lon + 540) % 360) - 180; const boxShift = 360 * Math.round((a.lon - box.minLon) / 360); for (const [start, delta, min, max] of [[a.lon, lonDelta, box.minLon + boxShift, box.maxLon + boxShift], [a.lat, b.lat - a.lat, box.minLat, box.maxLat]]) {
    if (delta === 0) {
        if (start < min || start > max)
            return false;
    }
    else {
        const v1 = (min - start) / delta, v2 = (max - start) / delta;
        low = Math.max(low, Math.min(v1, v2));
        high = Math.min(high, Math.max(v1, v2));
        if (low > high)
            return false;
    }
} return true; }
export function analyze(rows) { const errors = validate(rows); if (errors.length)
    throw Error(errors.slice(0, 5).join('; ')); const findings = []; const add = (rule, severity, at, reason) => { if (!findings.some(f => f.rule === rule))
    findings.push({ rule, severity, at, reason }); }; let altRun = 0, imuRun = 0, powerStart = -1; for (let i = 0; i < rows.length; i++) {
    const r = rows[i], p = rows[i - 1];
    if (p) {
        const dt = r.t - p.t;
        if (dt <= 0 || dt > 5) {
            altRun = 0;
            imuRun = 0;
        }
        if (dt <= 0) {
            const existing = findings.find(f => f.rule === 'R4');
            if (existing && dt < 0) {
                existing.severity = 'CRITICAL';
                existing.at = r.t;
                existing.reason = 'Timestamp moved backwards';
            }
            else
                add('R4', dt < 0 ? 'CRITICAL' : 'WARNING', r.t, 'Non-increasing timestamp');
        }
        else if (dt > 5)
            add('R4', 'WARNING', r.t, 'Time gap exceeds 5s');
        if (dt > 0 && dt <= 5) {
            const speed = distance(p, r) / dt;
            if (speed > 40)
                add('R1', 'CRITICAL', r.t, 'Speed exceeds demo 40 m/s threshold');
            imuRun = speed > 2 && r.ax === p.ax && r.gx === p.gx ? imuRun + 1 : 0;
            if (imuRun >= 14)
                add('R3', 'CRITICAL', r.t, 'IMU frozen for 15 moving records');
        }
        if (dt > 0 && dt <= 5 && intersects(p, r))
            add('R6', 'CRITICAL', r.t, 'Intersects synthetic polygon');
    }
    if (inside(r))
        add('R6', 'CRITICAL', r.t, 'Inside synthetic polygon');
    const continuous = i === 0 || (r.t > rows[i - 1].t && r.t - rows[i - 1].t <= 5);
    altRun = continuous && Math.abs(r.gpsAlt - r.baroAlt) > 30 ? altRun + 1 : 0;
    if (altRun >= 3)
        add('R2', 'WARNING', r.t, 'Altitude difference >30m; reference datum needs review');
    if (r.baroAlt > 120)
        add('R7', 'WARNING', r.t, 'Exceeds demonstration altitude threshold');
    if (r.motor >= 80) {
        if (powerStart < 0 || (p && (r.t <= p.t || r.t - p.t > 5 || r.voltage !== p.voltage || p.motor < 80)))
            powerStart = i;
        if (r.t - rows[powerStart].t >= 60)
            add('R5', 'WARNING', r.t, 'Constant reported voltage at high motor command; not proof of tampering');
    }
    else
        powerStart = -1;
} return { status: findings.some(f => f.severity === 'CRITICAL') ? 'CRITICAL' : findings.length ? 'WARNING' : 'CLEAN', findings }; }
