# AgeGate Testing Log — Day 15

## Test Scenarios

| Scenario | Result |
|---|---|
| Poor lighting | No face detected — expected AI limitation |
| No face in frame | "No face detected" message shown correctly |
| Camera permission denied | "Camera access denied" message shown correctly |
| Rapid repeated scan clicks | Stable, no crashes |
| History page loads saved scans | Working correctly |
| Visiting /scanner while logged out | Redirected to /login correctly |
| Logout button | Redirects to /login correctly |

## Bugs Found & Fixed
- No logout button — added to ScannerScreen
- Age displayed as single number (false precision) — changed to age range buckets
- History page showed oldest scans first — reversed to show newest first

## Known Limitations
- Face detection requires adequate lighting
- AI age estimate has ±3-5 year margin of error — age ranges used to communicate this honestly
- Image capture is tester-only, not for real customers (per project spec)
