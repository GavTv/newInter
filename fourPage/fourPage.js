const IMAGES = [
  "images/jellyfish-00.jpg",
  "images/jellyfish-01.jpg",
  "images/jellyfish-02.jpg",
  "images/jellyfish-03.jpg",
  "images/jellyfish-04.jpg",
  "images/jellyfish-05.jpg",
  "images/jellyfish-06.jpg",
  "images/jellyfish-07.jpg",
  "images/jellyfish-08.jpg",
  "images/jellyfish-09.jpg",
  "images/jellyfish-10.jpg",
  "images/jellyfish-11.jpg"
];

const carousel = document.getElementById("carousel");

if (carousel) {
  carousel.style.setProperty("--n", IMAGES.length);

  carousel.innerHTML = IMAGES.map(
    (src, index) =>
      `<img class="card" src="${src}" style="--i: ${index}" alt="jellyfish" decoding="async" draggable="false">`
  ).join("");

  let touchTimer;

  const pause = () => carousel.classList.add("is-paused");
  const resume = () => carousel.classList.remove("is-paused");

  carousel.addEventListener("touchstart", pause, { passive: true });
  carousel.addEventListener("touchend", () => {
    clearTimeout(touchTimer);
    touchTimer = setTimeout(resume, 400);
  }, { passive: true });
  carousel.addEventListener("touchcancel", resume, { passive: true });
}
