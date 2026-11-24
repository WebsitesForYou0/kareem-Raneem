'use strict';
/* ===== كل البيانات هنا — عدّل من هنا فقط ===== */
const CONFIG = {
  boyName: "Kareem",
  girlName: "Raneem",
  password: "10/11",
  relationshipDate: "2026-11-10T00:00:00",
  boyBirthday: "2010-09-05",
  girlBirthday: "2010-08-08",        // تاريخ ميلاد رنيم (YYYY-MM-DD)
  songName: "يا نصيبي",
  songArtist: "",                    // ← اسم الفنان (اختياري)
  songPath: "assets/music/song.mp3"
};

(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.random() * a.length | 0];

/* ---- ربط البيانات ---- */
const B = { boyName: CONFIG.boyName, girlName: CONFIG.girlName, names: CONFIG.boyName + " & " + CONFIG.girlName, songName: CONFIG.songName };
$$("[data-bind]").forEach(e => e.textContent = B[e.dataset.bind]);
$$("[data-init]").forEach(e => e.textContent = (B[e.dataset.init] || "?")[0]);
$("#songArtist").textContent = CONFIG.songArtist || "";
const fmtB = v => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || ""); return m ? `${m[3]}/${m[2]}/${m[1]}` : null; };
[["#boyB", CONFIG.boyBirthday], ["#girlB", CONFIG.girlBirthday]].forEach(([id, v]) => {
  const e = $(id), t = fmtB(v); e.textContent = t || "Soon ❤️"; e.classList.toggle("soon", !t);
});

/* ---- ورود وبتلات وقلوب (Canvas) ---- */
const FX = (() => {
  const cv = $("#fx"), c = cv.getContext("2d"), COL = ["#e11d48", "#be123c", "#fb7185", "#fda4af", "#ffe4e6", "#f43f5e"];
  let W, H, P = [], Hs = [], Bu = [], base = 0;
  const size = () => { const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; c.setTransform(d, 0, 0, d, 0, 0); };
  const petal = init => ({ x: rand(0, W), y: init ? rand(-H, H) : rand(-H * .3, -10), s: rand(6, 13), vy: rand(.6, 1.5), vx: rand(-.3, .3), r: rand(0, 6.3), vr: rand(-.02, .02), f: rand(0, 6.3), vf: rand(.01, .04), w: rand(0, 6.3), wa: rand(.2, .8), c: pick(COL), a: rand(.6, .95) });
  const heart = init => ({ x: rand(0, W), y: init ? rand(0, H) : H + 20, s: rand(4, 12), vy: rand(.3, .8), w: rand(0, 6.3), c: pick(["#fff", "#ffc2d1", "#ff8fa3"]), a: rand(.2, .5) });
  const hp = (x, y, s) => { c.beginPath(); c.moveTo(x, y + s * .9); c.bezierCurveTo(x - s * 1.6, y - s * .1, x - s * .7, y - s * 1.2, x, y - s * .4); c.bezierCurveTo(x + s * .7, y - s * 1.2, x + s * 1.6, y - s * .1, x, y + s * .9); c.fill(); };
  size(); const small = W < 640; base = small ? 22 : 46;
  for (let i = 0; i < base; i++) P.push(petal(1));
  for (let i = 0; i < (small ? 10 : 20); i++) Hs.push(heart(1));
  addEventListener("resize", size);
  (function loop() {
    c.clearRect(0, 0, W, H);
    for (const p of P) {
      p.y += p.vy; p.w += .02; p.x += p.vx + Math.sin(p.w) * p.wa; p.r += p.vr; p.f += p.vf;
      if (p.y > H + 20) { p.y = -20; p.x = rand(0, W); }
      const s = p.s; c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.scale(Math.abs(Math.cos(p.f)) * .75 + .25, 1);
      c.globalAlpha = p.a; c.fillStyle = p.c; c.beginPath(); c.moveTo(0, -s);
      c.bezierCurveTo(s * .9, -s * .6, s * .8, s * .6, 0, s); c.bezierCurveTo(-s * .8, s * .6, -s * .9, -s * .6, 0, -s); c.fill(); c.restore();
    }
    for (const h of Hs) {
      h.y -= h.vy; h.w += .015; h.x += Math.sin(h.w) * .4; if (h.y < -20) { h.y = H + 20; h.x = rand(0, W); }
      c.globalAlpha = h.a; c.fillStyle = h.c; hp(h.x, h.y, h.s);
    }
    for (let i = Bu.length - 1; i >= 0; i--) {
      const b = Bu[i]; b.vy += .12; b.vx *= .995; b.x += b.vx; b.y += b.vy; b.life -= b.d;
      if (b.life <= 0) { Bu.splice(i, 1); continue; }
      c.globalAlpha = b.life; c.fillStyle = b.c;
      if (b.h) hp(b.x, b.y, b.s); else { c.beginPath(); c.ellipse(b.x, b.y, b.s * .5, b.s, b.x * .05, 0, 6.3); c.fill(); }
    }
    c.globalAlpha = 1; requestAnimationFrame(loop);
  })();
  return {
    addPetals: n => { for (let i = 0; i < n && P.length < 130; i++) P.push(petal(0)); },
    trim: () => { P.length = Math.min(P.length, base); },
    burst: n => {
      for (let i = 0; i < n; i++) { const a = rand(-3, -.15), sp = rand(3, 9) * (W < 640 ? .8 : 1.1);
        Bu.push({ x: W / 2 + rand(-30, 30), y: H * .62, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, d: rand(.004, .009), s: rand(6, 14), h: Math.random() < .65, c: pick(COL) }); }
      if (Bu.length > 120) Bu.splice(0, Bu.length - 120);
    }
  };
})();

/* ---- التنقل بين الأقسام (بدون إعادة تحميل) ---- */
const views = { gate: $("#gate"), loader: $("#loader"), main: $("#main"), final: $("#final") };
const show = n => Object.entries(views).forEach(([k, v]) => { v.classList.toggle("active", k === n); v.inert = k !== n; });
const main = views.main;

/* ---- كلمة المرور ---- */
const norm = s => String(s).replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/\D/g, ""); // بيقارن الأرقام بس، أيًا كان شكل علامة الفصل
$("#gateForm").addEventListener("submit", e => {
  e.preventDefault();
  const pw = $("#pw"), msg = $("#gateMsg"), box = $("#gateBox");
  if (norm(pw.value) === norm(CONFIG.password)) { msg.textContent = ""; pw.blur(); runLoader(); return; }
  msg.textContent = "Oops! Try Again ❤️"; pw.value = ""; pw.focus();
  box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake");
});

/* ---- تحميل القلب ---- */
function runLoader() {
  show("loader");
  const rect = $("#fillRect"), pct = $("#pct"), heart = $("#bigHeart"), D = 3000, t0 = performance.now();
  (function tick(now) {
    const p = Math.min(Math.max((now - t0) / D, 0), 1);
    rect.setAttribute("y", 92 - 92 * p); pct.textContent = Math.round(p * 100) + "%";
    if (p < 1) return requestAnimationFrame(tick);
    heart.classList.add("glow"); const f = $("#flash"); f.classList.add("go"); FX.burst(18);
    setTimeout(() => { show("main"); startReveal(); }, 700);
    setTimeout(() => { f.classList.remove("go"); heart.classList.remove("glow"); }, 1500);
  })(t0);
}

/* ---- ظهور تدريجي ---- */
let revealed = false;
function startReveal() {
  if (revealed) return; revealed = true;
  $$(".letter").forEach(l => $$(".line", l).forEach((n, i) => n.style.setProperty("--i", i)));
  const chk = () => $$("#main .reveal:not(.in)").forEach(n => { const r = n.getBoundingClientRect(); if (r.top < innerHeight * .92 && r.bottom > 0) n.classList.add("in"); });
  setTimeout(() => { chk(); setInterval(chk, 400); }, 500);
}

/* ---- مشغل الموسيقى ---- */
(() => {
  const a = new Audio(), pl = $("#player"), seek = $("#seek"), cur = $("#cur"), dur = $("#dur"), note = $("#musicNote"), vol = $("#vol");
  a.preload = "metadata"; a.src = CONFIG.songPath; a.volume = .8;
  const t = s => isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "0:00";
  const prog = () => { const p = a.duration ? a.currentTime / a.duration * 1000 : 0; seek.value = p; seek.style.setProperty("--p", p / 10 + "%"); cur.textContent = t(a.currentTime); };
  const fail = () => { note.textContent = "Song file not found — add it at " + CONFIG.songPath; pl.classList.remove("playing"); };
  a.addEventListener("loadedmetadata", () => { dur.textContent = t(a.duration); seek.disabled = false; note.textContent = ""; });
  a.addEventListener("timeupdate", prog);
  a.addEventListener("error", fail);
  a.addEventListener("play", () => pl.classList.add("playing"));
  a.addEventListener("pause", () => pl.classList.remove("playing"));
  a.addEventListener("ended", () => { a.currentTime = 0; prog(); });
  $("#play").onclick = () => a.paused ? a.play().catch(fail) : a.pause();
  $("#stop").onclick = () => { a.pause(); a.currentTime = 0; prog(); };
  $("#restart").onclick = () => { a.currentTime = 0; a.play().catch(fail); };
  seek.addEventListener("input", () => { if (a.duration) { a.currentTime = seek.value / 1000 * a.duration; prog(); } });
  const setV = () => { a.volume = vol.value / 100; vol.style.setProperty("--p", vol.value + "%"); };
  vol.addEventListener("input", setV); setV();
})();

/* ---- العداد ---- */
(() => {
  const start = new Date(CONFIG.relationshipDate), since = $("#since");
  const addM = (d, n) => { const r = new Date(d), day = r.getDate(); r.setDate(1); r.setMonth(r.getMonth() + n); r.setDate(Math.min(day, new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate())); return r; };
  function parts(a, b) {
    let m = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth(); if (addM(a, m) > b) m--;
    let t = addM(a, m), days = 0;
    for (;;) { const n = new Date(t); n.setDate(n.getDate() + 1); if (n > b) break; t = n; days++; }
    let r = b - t; const hours = Math.floor(r / 36e5); r -= hours * 36e5; const minutes = Math.floor(r / 6e4); r -= minutes * 6e4;
    return { years: Math.floor(m / 12), months: m % 12, days, hours, minutes, seconds: Math.floor(r / 1e3) };
  }
  function render() {
    if (isNaN(start)) return;
    const now = new Date(), before = now < start, p = parts(before ? now : start, before ? start : now);
    for (const k in p) { const e = $(`[data-u="${k}"]`); const v = String(p[k]); if (e.textContent !== v) e.textContent = v; }
    const d = start.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    since.textContent = before ? "Our story begins on " + d : "Since " + d;
  }
  render(); setInterval(render, 1000);
})();

/* ---- الرسالة الأخيرة ---- */
let timers = [];
const later = (f, ms) => timers.push(setTimeout(f, ms));
const resetFinal = () => $$("#final .fade").forEach(n => n.classList.remove("in"));
$("#bubble").addEventListener("click", () => {
  const btn = $("#bubble"); btn.classList.add("sent"); FX.burst(10);
  later(() => {
    btn.classList.remove("sent");
    resetFinal(); views.final.scrollTop = 0; show("final"); FX.addPetals(30);
    $$("#fLetter .line").forEach((n, i) => n.style.setProperty("--i", i));
    const n = $$("#fLetter .line").length, t = 1500 + n * 1100 + 700;
    later(() => $("#fTitle").classList.add("in"), 500);
    later(() => { $("#fLetter").classList.add("in"); FX.burst(14); }, 1500);
    later(() => { $("#forever").classList.add("in"); FX.burst(40); FX.addPetals(30); }, t);
    later(() => FX.burst(26), t + 1600);
    later(() => $("#backTop").classList.add("in"), t + 2000);
  }, 600);
});
$("#backTop").addEventListener("click", () => {
  timers.forEach(clearTimeout); timers = [];
  show("main"); main.scrollTop = 0; FX.trim(); setTimeout(resetFinal, 1000);
});
})();
