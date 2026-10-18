from pathlib import Path
import json
r=Path(__file__).resolve().parent
api=(r/'api-runtime.txt').read_text().replace('function renderBooking(){}','')
s=(r/'runtime.js').read_text();modules='const SOURCE_ICONS='+json.dumps(json.loads((r/'icon-grids.json').read_text()))+';\nconst THINKING_SVG='+json.dumps((r.parent/'assets/thinking.svg').read_text())+';\n'+'\n'.join((r/f).read_text() for f in ['ai-connection.js','booking.js','voice.js','widgets.js','voice-actions.js','sera.js']);s=s.replace('// Existing CTAs',api+'\n'+modules+'\n// Existing CTAs');s=s.replace("window.addEventListener('intellignce:open-consultation',open);", "bindVoice();installDotSystem();installWebsiteDots();$('.book-call').onclick=beginBooking;window.addEventListener('intellignce:open-consultation',open);")
engine=(r/'engine.txt').read_text().replace("(()=>{'use strict';", "(()=>{'use strict';\n"+(r/'date-bundle.js').read_text())
js=engine+'const CHAT_CSS='+json.dumps((r/'chat.css').read_text())+';\nconst PUBLIC_FAQS='+json.dumps(json.loads((r/'intellignce-support/knowledge.json').read_text())['faqs'])+';\n'+s+"\n}\nconst start=()=>setTimeout(mount,1500);if(document.readyState==='complete')start();else window.addEventListener('load',start,{once:true});\n})();\n"
for name in ['widget.js','widget-v9.js','widget-v8.js','widget-v7.js','widget-v6.js','widget-v5.js','widget-v4.1.js']:(r/'intellignce-support'/name).write_text(js)
print(len(js),'bytes')
