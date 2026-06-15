const text = "faaaaaaa.";
const colors = [
  "#16D3FF",
  "#00AAD2",
  "#10FB06",
  "#C8FF01",
  "#FBB202",
  "#FA3200",
  "#F61272",
  "#F903B5",
  "#F903B5"
];

const isFileProtocol = location.protocol === "file:";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function initTitle() {
  const title = document.querySelector(".title");
  if (!title) return;

  title.innerHTML = [...text]
    .map((letter, index) => {
      const color = colors[index % colors.length];
      return `<span style="--letter-color: ${color};">${letter}</span>`;
    })
    .join("");
}

async function loadModelData() {
  if (!isFileProtocol || window.THIRD_PAGE_MODEL_URL) return;

  await loadScript("assets/model-data.js");
}

async function initModelViewer() {
  await loadModelData();

  if (!customElements.get("model-viewer")) {
    await customElements.whenDefined("model-viewer");
  }

  const modelViewer = document.querySelector(".my_model");
  const modelWrap = document.querySelector(".model-wrap");
  if (!modelViewer || !modelWrap) return;

  const loaderStatus = document.querySelector(".model-loader__status");
  const loaderText = document.querySelector(".model-loader__text");
  const loaderProgress = document.querySelector(".model-loader__progress");
  const loaderPercent = document.querySelector(".model-loader__percent");

  modelViewer.src = isFileProtocol
    ? window.THIRD_PAGE_MODEL_URL
    : "assets/output.glb";

  modelViewer.addEventListener("progress", (event) => {
    const percent = Math.round(event.detail.totalProgress * 100);

    if (loaderProgress) {
      loaderProgress.style.width = `${percent}%`;
    }

    if (loaderPercent) {
      loaderPercent.textContent = `${percent}%`;
    }

    if (loaderStatus) {
      loaderStatus.textContent = "Загружаю 3D-модель";
    }
  });

  modelViewer.addEventListener("load", () => {
    if (loaderStatus) {
      loaderStatus.textContent = "3D-модель загружена";
    }

    if (loaderPercent) {
      loaderPercent.textContent = "100%";
    }

    if (loaderProgress) {
      loaderProgress.style.width = "100%";
    }

    modelWrap.classList.add("is-model-loaded");
  });

  modelViewer.addEventListener("error", () => {
    modelWrap.classList.add("has-model-error");

    if (loaderStatus) {
      loaderStatus.textContent = "Не удалось загрузить модель";
    }

    if (loaderText) {
      loaderText.textContent = isFileProtocol
        ? "Не найден assets/model-data.js рядом с third.html."
        : "Проверь, что assets/output.glb лежит на месте.";
    }

    if (loaderPercent) {
      loaderPercent.textContent = "";
    }
  });
}

initTitle();
initModelViewer();
