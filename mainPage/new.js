const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

/* ── Ticker ─────────────────────────────────────────── */
const T =
  " git log --family ✦ 3 commits, 3 lives ✦ no issues open ✦ books + code ✦ factory → keyboard ✦ math: personal ✦ readme.md: just lived ✦ merge: natural ✦ branch: her own ✦ no forks needed ✦ ";
document.getElementById("ticker-inner").textContent = T.repeat(3);

/* ── Chess board ────────────────────────────────────── */
const CHESS = [
  "♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜",
  "♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙",
  "♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖",
];
const board = document.getElementById("chess-board");
CHESS.forEach((p, i) => {
  const r = Math.floor(i / 8);
  const cell = document.createElement("div");
  cell.className = "cell " + ((r + Math.floor(i % 8)) % 2 === 0 ? "light" : "dark");
  if (p) {
    cell.textContent = p;
    cell.style.color =
      r < 2 ? "#00D4FF" : r > 5 ? "#FFE600" : cell.classList.contains("dark") ? "#eee" : "#111";
  }
  board.appendChild(cell);
});

/* ── Books ──────────────────────────────────────────── */
const BOOKS = [
  { t: "ALGORITHM DESIGN", c: "#FFE600" },
  { t: "WAR AND PEACE", c: "#00D4FF" },
  { t: "NUMERICAL METHODS", c: "#FF2D9E" },
  { t: "THE NAME OF THE ROSE", c: "#9B5DE5" },
  { t: "CRIME AND PUNISHMENT", c: "#39FF14" },
  { t: "THE MASTER & MARGARITA", c: "#FF6B35" },
  { t: "PROGRAMMING IN PASCAL", c: "#FFE600" },
];
const stack = document.getElementById("book-stack");
BOOKS.forEach((b) => {
  const el = document.createElement("div");
  el.className = "book";
  el.style.background = b.c;
  el.innerHTML = `<div class="spine"></div>${b.t}`;
  stack.appendChild(el);
});

/* ── Mini books ─────────────────────────────────────── */
const MH = [52, 68, 45, 62, 55, 42, 70, 48];
const MC = ["#FFE600", "#00D4FF", "#FF2D9E", "#9B5DE5", "#39FF14", "#FF6B35", "#FFE600", "#00D4FF"];
const mb = document.getElementById("mini-books");
MH.forEach((h, i) => {
  const b = document.createElement("div");
  b.className = "mbook";
  b.style.height = h + "px";
  b.style.background = MC[i];
  mb.appendChild(b);
});

/* ── Gallery strip ──────────────────────────────────── */
const GALLERY = [
  { src: "images/hero-1.jpg" },
  { src: "images/hero-4.jpg" },
  { src: "images/hero-2.jpg" },
  { src: "images/chapter-me-1.jpg" },
  { src: "images/hero-3.jpg" },
  { src: "images/gallery-6.jpg" },
  { src: "images/gallery-7.jpg" },
  { src: "images/chapter-mother.jpg" },
  { src: "images/chapter-me-2.jpg" },
];
const row = document.getElementById("gallery-row");
GALLERY.forEach((g) => {
  const item = document.createElement("div");
  item.className = "gal-item";
  item.innerHTML = `<img src="${g.src}" alt="" loading="lazy"><div class="gal-caption">// local</div>`;
  row.appendChild(item);
});

/* ── Cursor (desktop only) ──────────────────────────── */
const cur = document.getElementById("cur");

if (finePointer.matches && cur) {
  document.addEventListener("mousemove", (e) => {
    cur.style.left = e.clientX + "px";
    cur.style.top = e.clientY + "px";
  });
  document.addEventListener("mousedown", () => document.body.classList.add("cur-click"));
  document.addEventListener("mouseup", () => document.body.classList.remove("cur-click"));
  document.addEventListener("mouseleave", () => (cur.style.opacity = "0"));
  document.addEventListener("mouseenter", () => (cur.style.opacity = "1"));
} else if (cur) {
  cur.style.display = "none";
}

/* ── Scroll reveal ──────────────────────────────────── */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ── Ghost parallax ─────────────────────────────────── */
window.addEventListener(
  "scroll",
  () => {
    document.querySelectorAll(".ghost").forEach((g) => {
      g.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    });
  },
  { passive: true }
);

/* ── Touch: tap ≈ hover on interactive blocks ─────── */
const touchUI = window.matchMedia("(hover: none), (pointer: coarse)");
const touchSelectors =
  ".photo-frame, .book, .mbook, .gal-item, .thread-img, .tnode-dot, .epi-card, .motto";

function bindTouchFeedback() {
  document.querySelectorAll(touchSelectors).forEach((el) => {
    el.addEventListener(
      "touchstart",
      () => el.classList.add("is-touch"),
      { passive: true }
    );
    const end = () => el.classList.remove("is-touch");
    el.addEventListener("touchend", end, { passive: true });
    el.addEventListener("touchcancel", end, { passive: true });
  });

  const videoBreak = document.getElementById("video-break");
  if (videoBreak) {
    videoBreak.addEventListener(
      "touchstart",
      () => videoBreak.classList.add("is-touch"),
      { passive: true }
    );
    const end = () => videoBreak.classList.remove("is-touch");
    videoBreak.addEventListener("touchend", end, { passive: true });
    videoBreak.addEventListener("touchcancel", end, { passive: true });
  }
}

if (touchUI.matches) bindTouchFeedback();
touchUI.addEventListener("change", (e) => {
  if (e.matches) bindTouchFeedback();
});
