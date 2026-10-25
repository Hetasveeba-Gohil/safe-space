// Safe Space - runs fully in the browser. No server, no tracking.
const $ = s => document.querySelector(s);
const app = $('#app');
const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// ---------- CONTENT (edit here; have an NGO or lawyer review it) ----------
const FLOWS = {
  threat: {
    icon: '🛑', title: 'Someone is threatening me',
    sub: 'Sextortion, blackmail, or threats to leak photos',
    now: ['You are not at fault. This is a crime, and many people have been through it.',
          'Do NOT pay or send more photos. Payment usually leads to more demands.',
          'Do NOT delete the chat yet. It is your evidence.'],
    save: ['Screenshot the full chat, including their username and profile link.',
           'Save any payment demands, phone numbers, UPI IDs or wallet addresses.',
           'Add each screenshot to the Evidence vault so it gets a timestamp and fingerprint.'],
    report: ['Report at cybercrime.gov.in (choose the women/child related crime section).',
             'Call 1930 if money was sent, or 112 if you feel in danger.',
             'Then report and block the account on the platform.',
             'If photos exist, start a StopNCII.org case so they can be blocked from spreading.']
  },
  fake: {
    icon: '🎭', title: 'Fake profile or morphed photo',
    sub: 'Someone is pretending to be me or editing my photos',
    now: ['Do not reply to the account or confront the person.',
          'Ask a friend to also report the profile, since more reports can speed up removal.'],
    save: ['Screenshot the profile, the posts, and the URL in the address bar.',
           'Note the date and time you first saw it.',
           'Add the screenshots to the Evidence vault.'],
    report: ['Use the platform\'s "impersonation" or "intimate image" report option.',
             'File a complaint at cybercrime.gov.in with the profile link.',
             'Tell people you trust so they do not fall for the fake account.']
  },
  leak: {
    icon: '🔒', title: 'My private photos were leaked',
    sub: 'Intimate images shared or posted without consent',
    now: ['Sharing intimate images without consent is a crime. The blame is on the person who shared them.',
          'Breathe. Take the next steps one at a time.'],
    save: ['Screenshot where the images appear, with the URL and date. Do not re-share the images.',
           'Add the screenshots to the Evidence vault.'],
    report: ['Create a hash-based case at StopNCII.org. The fingerprint is made on your device, and the image is not uploaded.',
             'Use the platform\'s "non-consensual intimate image" report form.',
             'File at cybercrime.gov.in and keep the acknowledgement number.',
             'Talk to a trusted person or call 181 for support.']
  },
  stalk: {
    icon: '👁️', title: 'Someone is stalking or tracking me',
    sub: 'Unwanted contact, spying, location or device tracking',
    now: ['If you are in immediate danger, call 112.',
          'Do not tell the person you suspect them, since that can make things worse.',
          'Use a safe device (a friend\'s phone) to look for help if you think yours is watched.'],
    save: ['Log every incident: date, time, what happened, screenshots of messages.',
           'Save call logs and any unknown numbers.'],
    report: ['Run the Device check (link on the home page) on your phone and accounts.',
             'Report stalking at cybercrime.gov.in or at your local police station.',
             'Call 181 for the women\'s helpline.']
  }
};

const HELP = [
  ['112', 'Emergency (police, ambulance)', 'tel:112'],
  ['181', 'Women\'s helpline', 'tel:181'],
  ['1930', 'Cyber crime helpline (financial fraud and cyber crime reports)', 'tel:1930'],
  ['cybercrime.gov.in', 'National cyber crime reporting portal', 'https://cybercrime.gov.in'],
  ['StopNCII.org', 'Stops intimate images from spreading, with on-device hashing', 'https://stopncii.org']
];

const DEVICE = [
  'WhatsApp > Settings > Linked devices: remove any device you do not recognise.',
  'Google account > Security > Your devices: sign out unknown devices.',
  'Instagram/Facebook > Settings > Accounts Center > Where you\'re logged in: log out unknown sessions.',
  'Phone > Settings > Apps: look for apps you did not install, especially ones with "Device admin" access.',
  'Google Maps > Location sharing: stop sharing with anyone you no longer want to.',
  'Change passwords from a safe device and turn on two-step verification.',
  'Check who has your passwords, shared accounts, or cloud photo albums.'
];

// ---------- VIEWS ----------
const list = a => '<ul>' + a.map(x => `<li>${esc(x)}</li>`).join('') + '</ul>';

const SK = 'safe_space_steps';
const steps = () => { try { return JSON.parse(localStorage.getItem(SK)) || {}; } catch { return {}; } };

function home() {
  app.innerHTML = `<div class="reassure"><b>You are not alone, and this is not your fault.</b> Pick what is happening. We will take it one step at a time.</div><h2>What is happening?</h2><div class="grid">` +
    Object.entries(FLOWS).map(([k, f]) => `<a class="big" href="#flow-${k}"><span class="ic" aria-hidden="true">${f.icon}</span><span><b>${esc(f.title)}</b><span class="t">${esc(f.sub)}</span></span></a>`).join('') +
    `</div><div class="panel"><h3>Tools</h3><p>Save proof safely, write your complaint, and check your phone for spying.</p>
    <a class="btn" href="#vault">Evidence vault</a><a class="btn alt" href="#complaint">Complaint writer</a><a class="btn alt" href="#device">Device check</a></div>`;
}

function flow(k) {
  const f = FLOWS[k]; if (!f) return home();
  const st = steps();
  const sec = (id, title, arr, cls) => `<div class="panel ${cls || ''}"><h3>${title}</h3>` + arr.map((t, i) => {
    const key = `${k}:${id}:${i}`;
    return `<label class="chk"><input type="checkbox" data-k="${key}" ${st[key] ? 'checked' : ''}><span>${esc(t)}</span></label>`;
  }).join('') + '</div>';
  app.innerHTML = `<h2>${f.icon} ${esc(f.title)}</h2>
  <div class="panel"><b id="prog"></b><div class="bar"><i id="barfill"></i></div><small class="sub">Tick each step when done. Your progress stays on this device only.</small></div>
  ${sec('now', 'Right now', f.now, 'warn')}
  ${sec('save', 'Save proof first (before blocking or deleting)', f.save)}
  <a class="btn" href="#vault" style="margin-top:0">Open evidence vault</a>
  ${sec('report', 'Where to report', f.report)}
  <a class="btn" href="#complaint">Write my complaint</a><a class="btn alt" href="#help">Helplines</a>`;
  const boxes = [...document.querySelectorAll('.chk input')];
  const upd = () => {
    const d = boxes.filter(x => x.checked).length;
    $('#prog').textContent = `${d} of ${boxes.length} steps done`;
    $('#barfill').style.width = (100 * d / boxes.length) + '%';
  };
  boxes.forEach(x => x.onchange = () => { const s2 = steps(); s2[x.dataset.k] = x.checked; localStorage.setItem(SK, JSON.stringify(s2)); upd(); });
  upd();
}

// ---------- EVIDENCE VAULT (SHA-256 fingerprint + timestamp, stored on this device) ----------
const KEY = 'safe_space_vault';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = v => localStorage.setItem(KEY, JSON.stringify(v));
async function sha256(buf) {
  const h = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function vault() {
  const items = load();
  app.innerHTML = `<h2>Evidence vault</h2>
  <p class="sub">Add a screenshot or file. The app records its SHA-256 fingerprint and the time. If the file is later changed, the fingerprint will no longer match. The file itself is not uploaded or stored by this app, so keep the original safe (for example in a private folder or email to yourself).</p>
  <div class="panel"><label for="f">Screenshot or file</label><input id="f" type="file" multiple>
  <label for="n">Note (where it came from, who sent it)</label><textarea id="n" rows="2"></textarea>
  <button class="btn" id="add">Add to vault</button>
  <label for="t">Or paste text / a link</label><textarea id="t" rows="2" placeholder="Message text or URL"></textarea>
  <button class="btn alt" id="addt">Add text</button></div>
  <h3>Saved (${items.length})</h3><div id="items"></div>
  <button class="btn noprint" id="exp">Print / save as PDF</button>
  <button class="btn alt noprint" id="clr">Clear vault</button>`;
  $('#items').innerHTML = items.length ? items.map((e, i) => `<div class="panel"><b>${i + 1}. ${esc(e.name)}</b><br>
    <small>${esc(e.time)} · ${esc(e.size)}</small><br>${e.note ? esc(e.note) + '<br>' : ''}<span class="hash">SHA-256: ${e.hash}</span></div>`).join('')
    : '<p>Nothing saved yet.</p>';
  $('#add').onclick = async () => {
    const files = $('#f').files; if (!files.length) return alert('Choose a file first.');
    const v = load();
    for (const file of files) v.push({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', hash: await sha256(await file.arrayBuffer()), note: $('#n').value, time: new Date().toString() });
    save(v); vault();
  };
  $('#addt').onclick = async () => {
    const t = $('#t').value.trim(); if (!t) return alert('Paste some text first.');
    const v = load();
    v.push({ name: 'Text: ' + t.slice(0, 40), size: t.length + ' chars', hash: await sha256(new TextEncoder().encode(t)), note: t, time: new Date().toString() });
    save(v); vault();
  };
  $('#exp').onclick = () => window.print();
  $('#clr').onclick = () => { if (confirm('Delete all saved entries from this device?')) { localStorage.removeItem(KEY); vault(); } };
}

// ---------- COMPLAINT WRITER ----------
function complaint() {
  app.innerHTML = `<h2>Complaint writer</h2>
  <p class="sub">Fill in what you know. You get a text you can paste into cybercrime.gov.in or take to a police station. Leave a field blank if you do not know.</p>
  <div class="panel">
  <label for="type">What happened</label><select id="type">${Object.values(FLOWS).map(f => `<option>${esc(f.title)}</option>`).join('')}</select>
  <label for="name">Your name</label><input id="name" autocomplete="off">
  <label for="when">When did it start? (date)</label><input id="when" type="date">
  <label for="plat">Platform (Instagram, WhatsApp, etc.)</label><input id="plat">
  <label for="who">Accused person's username, number or profile link</label><input id="who">
  <label for="desc">What happened, in your own words</label><textarea id="desc" rows="5"></textarea>
  <button class="btn" id="gen">Create complaint</button></div>
  <div id="out"></div>`;
  $('#gen').onclick = () => {
    const v = load();
    const txt = `To,\nThe Officer In-Charge, Cyber Crime Cell\n\nSubject: Complaint regarding "${$('#type').value}"\n\nI, ${$('#name').value || '[your name]'}, wish to report the following incident.\n\nPlatform: ${$('#plat').value || '[platform]'}\nAccused account / number: ${$('#who').value || '[unknown]'}\nFirst noticed on: ${$('#when').value || '[date]'}\n\nDetails:\n${$('#desc').value || '[describe what happened]'}\n\nEvidence: I have preserved ${v.length} item(s) with timestamps and SHA-256 fingerprints.\n${v.map((e, i) => `${i + 1}. ${e.name} | ${e.time} | ${e.hash}`).join('\n')}\n\nI request that you register my complaint, take action against the accused, and help get the content removed.\n\nDate: ${new Date().toDateString()}\nSignature: ____________`;
    $('#out').innerHTML = `<div class="panel"><pre id="txt">${esc(txt)}</pre>
    <button class="btn noprint" id="cp">Copy text</button><button class="btn alt noprint" id="pr">Print / save as PDF</button></div>`;
    $('#cp').onclick = () => navigator.clipboard.writeText(txt).then(() => alert('Copied.'));
    $('#pr').onclick = () => window.print();
  };
}

// ---------- DEVICE CHECK ----------
function device() {
  const done = JSON.parse(sessionStorage.getItem('dev') || '[]');
  app.innerHTML = `<h2>Device and account check</h2><p class="sub">Tick each item once you have checked it. If you think someone monitors your phone, do this on a friend's device.</p>
  <div class="panel">${DEVICE.map((d, i) => `<label class="chk"><input type="checkbox" data-i="${i}" ${done.includes(i) ? 'checked' : ''}> <span>${esc(d)}</span></label>`).join('')}</div>
  <p id="prog"></p>`;
  const upd = () => { const c = [...document.querySelectorAll('.chk input')]; sessionStorage.setItem('dev', JSON.stringify(c.map((x, i) => x.checked ? i : -1).filter(i => i >= 0))); $('#prog').textContent = c.filter(x => x.checked).length + ' of ' + c.length + ' checked'; };
  document.querySelectorAll('.chk input').forEach(x => x.onchange = upd); upd();
}

function help() {
  app.innerHTML = `<h2>Helplines and official sites</h2>` + HELP.map(h => `<a class="big" href="${h[2]}" style="margin-bottom:10px"><span><b>${esc(h[0])}</b><span class="t">${esc(h[1])}</span></span></a>`).join('') +
    `<p class="sub">Numbers and sites can change. Confirm them on the official portals.</p>`;
}

// ---------- WIPE ----------
$('#wipe').onclick = () => {
  if (confirm('Delete everything saved by this app on this device (vault, steps, checklist)?')) {
    localStorage.removeItem(KEY); localStorage.removeItem(SK); sessionStorage.clear(); alert('All data deleted.'); location.hash = 'home'; route();
  }
};

// ---------- ROUTER ----------
function route() {
  const h = location.hash.slice(1) || 'home';
  if (h.startsWith('flow-')) flow(h.slice(5));
  else ({ home, vault, complaint, device, help }[h] || home)();
  window.scrollTo(0, 0); app.focus();
}
addEventListener('hashchange', route);
route();
