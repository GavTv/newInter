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
  { src: "https://cdn.cosmos.so/dcec6266-f8c7-4810-ac99-695dc8b9e773?format=jpeg" },
  { src: "https://cdn.cosmos.so/b97b4bf8-3ac3-43d9-a99b-2115cf564507?format=jpeg" },
  { src: "https://cdn.cosmos.so/c1d6e80c-58e2-4166-abf6-af034bcf0e89?format=jpeg" },
  { src: "https://cdn.cosmos.so/1a81f94d-b922-4694-826e-f7088a8ec791?format=jpeg" },
  { src: "https://cdn.cosmos.so/6a03af1b-2ba3-4d04-adb7-5d3e04da147d?format=jpeg" },
  { src: "https://cdn.cosmos.so/ae033a50-d2e2-40af-b60f-efc748cf44a6?format=jpeg" },
  { src: "https://cdn.cosmos.so/6f8eeac7-36ad-4b90-b676-5fde27111268?format=jpeg" },
  { src: "https://cdn.cosmos.so/7ded77c0-a780-4f28-8a4e-6c5069b60e5a?format=jpeg" },
  { src: "https://cdn.cosmos.so/54f55f00-9438-4129-afad-bb2dd12c1904?format=jpeg" },
];
const row = document.getElementById("gallery-row");
GALLERY.forEach((g) => {
  const item = document.createElement("div");
  item.className = "gal-item";
  item.innerHTML = `<img src="${g.src}" alt="" loading="lazy"><div class="gal-caption">// cosmos.so</div>`;
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
