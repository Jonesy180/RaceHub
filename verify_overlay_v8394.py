from pathlib import Path
import re, json, subprocess
p=Path(__file__).parent
sw=(p/'otg-service-worker-v8394.js').read_text()
html=(p/'index-v8394.html').read_text()
assert (p/'index.html').read_bytes()==(p/'index-v8394.html').read_bytes()
for fname in ['index-v8394.html','js/bootstrap-v8394.js','js/update-wire-v8394.js','js/tet2-worlds-v8394.js','js/tet2-official-track-preflight-v8394.js']:
 assert (p/fname).exists(),fname
 assert fname in sw,f'Not referenced in service worker: {fname}'
for f in ['bootstrap-v8394.js','update-wire-v8394.js','tet2-worlds-v8394.js','tet2-official-track-preflight-v8394.js']:
 assert f in html,f'Not referenced in HTML: {f}'
assert '8.0.394' in html and 'otg-service-worker-v8394.js' in (p/'js/bootstrap-v8394.js').read_text()
assert 'index-v8394.html' in sw and 'index-v8393.html' not in sw
assert not re.search(r'(?:bootstrap|update-wire|tet2-worlds)-v8393',sw)
for f in ['version.json','update-manifest.json']:
 o=json.loads((p/f).read_text());assert o['version']=='8.0.394' and o['worker']=='./otg-service-worker-v8394.js'
for f in ['otg-service-worker-v8394.js','js/bootstrap-v8394.js','js/update-wire-v8394.js','js/tet2-worlds-v8394.js','js/tet2-official-track-preflight-v8394.js']:
 subprocess.run(['node','--check',str(p/f)],check=True)
subprocess.run(['node',str(p/'test_official_track_preflight_v8394.js')],check=True)
# Check critical URLs (regression-prevention: current-version URLs must be shipped). Historical URLs remain in prior accepted repository.
critical=sw.split('const critical=',1)[1].split(';',1)[0]
urls=re.findall(r"'\./([^']+)'",critical)
new=[u.split('?',1)[0] for u in urls if '8394' in u]
assert new and all((p/u).is_file() for u in new),new
assert 'tet2-track-readiness-v8393.js?v=8393' in sw, 'Prior read-only dependency accidentally removed'
print('OVERLAY / NEW CRITICAL REFERENCES / SYNTAX / VERSION / TESTS PASS')
print('Historical critical URLs are expected to come from existing repository; not independently verified here.')
