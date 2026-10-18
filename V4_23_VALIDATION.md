# v4.23 Input-size guard

Direct CSV/JSON parsing now enforces a 1 MiB UTF-8 byte limit before parsing, including browser-side imports. The HTTP server already has a separate request-size guard. Three regression tests cover oversized JSON, CSV and multibyte UTF-8 input. This is a demo resource guard, not a general security guarantee.
