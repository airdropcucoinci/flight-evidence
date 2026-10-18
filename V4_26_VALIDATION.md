# v4.26 – Antimeridian geofence fix

Longitude segments crossing ±180° now use the short unwrapped longitude delta. This prevents an artificial line across the map from intersecting the synthetic demo polygon. The rule still uses a simplified planar segment test and is not suitable for flight authorization.
