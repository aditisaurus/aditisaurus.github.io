/* ---------- Pixel sprites ----------
   Each sprite is a grid of characters; each character maps to a colour in PALETTE.
   '.' is transparent. Rendered as crisp SVG so nothing needs image files. */

const PALETTE = {
  h: '#3b2219', H: '#5a3424', s: '#d99a6c', e: '#1a1020', r: '#ff8fb8', m: '#c2405f',
  p: '#ff4fa3', P: '#ffb3d9', w: '#ffffff', W: '#e6defa', g: '#3df5a0', G: '#1fb877',
  t: '#6b5bff', b: '#6b6bff', l: '#b9a8ff', y: '#ffd23f', Y: '#e09a00',
  o: '#c9783a', O: '#8a4b20', k: '#9aa0b5', K: '#0f3a24',
};

const SPRITES = {
  girl: [
    '....hhhhhhh.....',
    '..hhhhhhhhhhhpp.',
    '.hhhhhhhhhhhhppp',
    '.hhhhsssssshhhp.',
    '.hhhssssssssshh.',
    '.hhssesssssessh.',
    '.hhssesssssessh.',
    '.hhsrsssssssrsh.',
    '.hhhsssmmssshhh.',
    '.hhhhssssssshhh.',
    '.hhhhhhssshhhhh.',
    'hhhpwwwwwwwwphhh',
    'hhppwwwppwwwpphh',
    'hhsswwwwwwwwsshh',
    '.hssppppppppssh.',
    '...pppppppppp...',
    '...pppppppppp...',
    '....ss....ss....',
    '....ss....ss....',
    '...www....www...',
    '...bbb....bbb...',
  ],
  cat: [
    'w...w.......',
    'ww.ww.......',
    'wwwww.......',
    'wewew......w',
    'wwpww.....w.',
    '.wwwwwwwwww.',
    '.wwwwwwwwww.',
    '.w.w....w.w.',
  ],
  heart: [
    '.pp.pp.',
    'ppppppp',
    'ppppppp',
    '.ppppp.',
    '..ppp..',
    '...p...',
  ],
  star: [
    '...y...',
    '...y...',
    'yyyyyyy',
    '.yyyyy.',
    '..yyy..',
    '.yy.yy.',
    'yy...yy',
  ],
  coin: [
    '..yyyy..',
    '.yyyyyy.',
    'yyyYyyyy',
    'yyyYyyyy',
    'yyyYyyyy',
    'yyyYyyyy',
    '.yyyyyy.',
    '..yyyy..',
  ],
  cloud: [
    '......wwww......',
    '....wwwwwwww.ww.',
    '..wwwwwwwwwwwwww',
    '.wwwwwwwwwwwwwww',
    'ppwwwwwwwwwwwwpp',
    '.pppppppppppppp.',
    '...llllllllll...',
  ],
  tree: [
    '....gggggg......',
    '..gggGgggggg....',
    '.ggGggggGgggg...',
    'gggggggggggGggg.',
    'ggGgggggggggggg.',
    '.gggggGgggggggg.',
    '..gggggggggggg..',
    '....gggtggggg...',
    '......ttt.gg....',
    '.......tt.......',
    '.......tt.......',
    '......ttt.......',
    '......tt........',
    '.....ttt........',
    '....ttttt.......',
  ],
  flower: [
    '..p.p..',
    '.ppppp.',
    '.ppPpp.',
    '..ppp..',
    '...g...',
    '.g.g.g.',
    '..ggg..',
    '...g...',
    '...g...',
  ],
  pipe: [
    'KKKKKKKKKK',
    'KgGggggggK',
    'KgGggggggK',
    'KKKKKKKKKK',
    '.KgGggggK.',
    '.KgGggggK.',
    '.KgGggggK.',
    '.KgGggggK.',
  ],
  door: [
    '..kkkkkk..',
    '.kkOOOOkk.',
    'kooOooOook',
    'kooOooOook',
    'kOOOOOOOOk',
    'kooOooOook',
    'kooOooOyok',
    'kooOooOook',
    'kOOOOOOOOk',
    'kooOooOook',
    'kooOooOook',
    'kkkkkkkkkk',
  ],
  flag: [
    'w.......',
    'wppp....',
    'wppppp..',
    'wppppppp',
    'wppp....',
    'w.......',
    'w.......',
    'w.......',
    'w.......',
    'w.......',
    'www.....',
  ],
};

function spriteSVG(rows, scale) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  let rects = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let run = 1;
      while (row[x + run] === c) run++;
      if (PALETTE[c]) rects += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${PALETTE[c]}"/>`;
      x += run;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges">${rects}</svg>`;
}

document.querySelectorAll('[data-sprite]').forEach((el) => {
  const rows = SPRITES[el.dataset.sprite];
  if (rows) el.innerHTML = spriteSVG(rows, Number(el.dataset.scale) || 4);
});

/* ---------- Marquee bands ---------- */
document.querySelectorAll('.marquee__track').forEach((track) => {
  const unit = `<span>${track.dataset.text}</span><span class="marquee__star">★</span>`;
  const half = unit.repeat(8);
  track.innerHTML = half + half; // duplicated so the -50% loop is seamless
});

/* ---------- HUD: HP bar tracks scroll, level tracks section ---------- */
const hp = document.getElementById('hp');
const levelEl = document.getElementById('level');
const levels = [['top', '00'], ['about', '01'], ['missions', '02'], ['quests', '03'], ['contact', '04']];

function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  hp.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  let current = levels[0][1];
  for (const [id, n] of levels) {
    const sec = document.getElementById(id);
    if (sec && sec.getBoundingClientRect().top < innerHeight * 0.4) current = n;
  }
  levelEl.textContent = current;
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Coins: click to collect ---------- */
const coinsEl = document.getElementById('coins');
let coins = 0;
document.querySelectorAll('.coin').forEach((coin) => {
  coin.addEventListener('click', () => {
    if (coin.classList.contains('got')) return;
    coin.classList.add('got');
    coinsEl.textContent = ++coins;
  });
});

/* ---------- CONTINUE? countdown when contact is on screen ---------- */
const countEl = document.getElementById('countdown');
let countTimer = null;
new IntersectionObserver(([entry]) => {
  clearInterval(countTimer);
  if (!entry.isIntersecting) return;
  let n = 9;
  countEl.textContent = n;
  countTimer = setInterval(() => {
    n = n > 0 ? n - 1 : 9;
    countEl.textContent = n;
  }, 1000);
}, { threshold: 0.4 }).observe(document.getElementById('contact'));

/* ---------- Music: original chiptune loop, off until the player presses ♪ ---------- */
const musicBtn = document.getElementById('music');
const STEP = 60 / 132 / 2; // eighth notes at 132 BPM
// MIDI note per eighth note, 0 = rest. One bar each: Am · F · C · G.
const LEAD = [
  76, 0, 72, 76, 81, 79, 76, 72,
  77, 0, 77, 76, 72, 0, 69, 72,
  76, 0, 79, 76, 72, 76, 79, 84,
  83, 0, 79, 74, 71, 74, 79, 0,
];
// Bass plays on every quarter note.
const BASS = [45, 57, 45, 57, 41, 53, 41, 53, 48, 60, 48, 60, 43, 55, 43, 55];
let audio, master, musicTimer, musicOn = false, step = 0, nextAt = 0;

function tone(midi, at, len, type, vol) {
  if (!midi) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = 440 * 2 ** ((midi - 69) / 12);
  gain.gain.setValueAtTime(vol, at);
  gain.gain.exponentialRampToValueAtTime(0.001, at + len);
  osc.connect(gain).connect(master);
  osc.start(at);
  osc.stop(at + len);
}

function scheduleMusic() {
  while (nextAt < audio.currentTime + 0.1) {
    tone(LEAD[step % LEAD.length], nextAt, STEP * 0.9, 'square', 0.12);
    if (step % 2 === 0) tone(BASS[(step / 2) % BASS.length], nextAt, STEP * 1.8, 'triangle', 0.3);
    nextAt += STEP;
    step++;
  }
}

function playMusic(play) {
  clearInterval(musicTimer);
  if (!play) { audio?.suspend(); return; }
  if (!audio) {
    audio = new AudioContext();
    master = audio.createGain();
    master.gain.value = 0.25;
    master.connect(audio.destination);
  }
  audio.resume();
  nextAt = audio.currentTime + 0.05;
  musicTimer = setInterval(scheduleMusic, 25);
}

musicBtn.addEventListener('click', () => {
  musicOn = !musicOn;
  musicBtn.setAttribute('aria-pressed', musicOn);
  musicBtn.textContent = musicOn ? '♪ ON' : '♪ OFF';
  playMusic(musicOn);
});
// Background tabs throttle timers, which would garble the loop, so pause while hidden.
document.addEventListener('visibilitychange', () => {
  if (musicOn) playMusic(!document.hidden);
});

/* ---------- Easter egg: Konami code rains hearts ---------- */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let pos = 0;
addEventListener('keydown', (e) => {
  pos = e.key === KONAMI[pos] ? pos + 1 : (e.key === KONAMI[0] ? 1 : 0);
  if (pos === KONAMI.length) { pos = 0; rainHearts(); }
});

function rainHearts() {
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('span');
    el.className = 'rain';
    el.innerHTML = spriteSVG(Math.random() < 0.5 ? SPRITES.heart : SPRITES.star, 3 + Math.floor(Math.random() * 3));
    el.style.left = `${Math.random() * 100}vw`;
    el.style.animationDelay = `${Math.random() * 1.5}s`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}
