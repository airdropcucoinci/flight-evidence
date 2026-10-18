import subprocess,time,json
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent
server=subprocess.Popen(['node','server.mjs'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
results=[]
try:
 time.sleep(1)
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':1280,'height':800},accept_downloads=True)
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto('http://127.0.0.1:3000/',wait_until='networkidle')
  for scenario,expected in [(1,'CLEAN'),(2,'CRITICAL'),(3,'WARNING'),(8,'CLEAN'),(9,'CRITICAL')]:
   page.get_by_test_id(f'sample-L{scenario}').click()
   actual=page.get_by_test_id('overall-status').get_attribute('data-status')
   results.append({'scenario':f'L{scenario}','expected':expected,'actual':actual,'pass':actual==expected})
  page.get_by_test_id('finding-filter').select_option('CRITICAL')
  results.append({'scenario':'critical-filter','pass':page.get_by_test_id('finding-filter').input_value()=='CRITICAL'})
  page.get_by_test_id('reset-filters').click()
  results.append({'scenario':'filter-reset','pass':page.get_by_test_id('finding-filter').input_value()=='ALL'})
  results.append({'scenario':'no-js-errors','pass':not errors,'errors':errors})
  page.screenshot(path=str(root/'browser-check.png'),full_page=True)
  browser.close()
finally:
 server.terminate();server.wait(timeout=5)
(root/'BROWSER_TEST_RESULTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps(results,ensure_ascii=False,indent=2))
