export function sample(id) {
    const rows = Array.from({ length: 301 }, (_, i) => ({ t: i, lat: 39 + i * .000025, lon: 32, gpsAlt: 70, baroAlt: 70, ax: Math.sin(i / 10), gx: Math.cos(i / 10), motor: 45, voltage: 16.8 - i * .001 }));
    switch (id) {
        case 2:
            rows[120].lat += .01;
            break;
        case 3:
            for (let i = 100; i < 110; i++)
                rows[i].gpsAlt += 120;
            break;
        case 4:
            for (let i = 100; i < 121; i++) {
                rows[i].ax = rows[99].ax;
                rows[i].gx = rows[99].gx;
            }
            break;
        case 5:
            rows[120].t = 118;
            break;
        case 6:
            for (let i = 100; i < 191; i++) {
                rows[i].motor = 90;
                rows[i].voltage = 16;
            }
            break;
        case 7:
            for (let i = 0; i < rows.length; i++) {
                rows[i].lon = 32.003;
            }
            break;
        case 8: { // Set a precise 40 m/s segment and resume at a smooth pace afterward.
            const lat = rows[120].lat;
            const target = 39.999; // Just below 40 m/s; exact threshold requires separate test.
            let lo = 0, hi = .001;
            for (let k = 0; k < 65; k++) {
                const mid = (lo + hi) / 2;
                const a = rows[120], b = { ...rows[121], lat: lat + mid, lon: a.lon };
                const d = 12742000 * Math.atan2(Math.sqrt(Math.sin((b.lat - a.lat) * Math.PI / 360) ** 2), Math.sqrt(1 - Math.sin((b.lat - a.lat) * Math.PI / 360) ** 2));
                if (d > target)
                    hi = mid;
                else
                    lo = mid;
            }
            rows[121].lat = lat + (lo + hi) / 2;
            rows[121].lon = rows[120].lon;
            for (let i = 122; i < rows.length; i++) {
                rows[i].lat = rows[121].lat + (i - 121) * .000025;
                rows[i].lon = rows[121].lon + (i - 121) * .000025;
            }
            break;
        }
        case 9:
            rows[120].lat += .01;
            for (let i = 150; i < 171; i++) {
                rows[i].ax = rows[149].ax;
                rows[i].gx = rows[149].gx;
            }
            for (let i = 200; i < 210; i++) {
                rows[i].lat = 39.003;
                rows[i].lon = 32.003;
            }
            break;
        case 10: return rows.slice(0, 5);
    }
    return rows;
}
