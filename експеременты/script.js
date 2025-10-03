const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRKK14xunqKwibvmHl9u1sqPHaehOxw5UahYllTH17UvaL-ystf6ipa7ciWSYRWyLw8xhqbGBaD92Xe/pub?output=csv";
const proxy = "https://api.allorigins.win/raw?url=" + encodeURIComponent(sheetUrl);

let poems = [];
let currentPoemIndex = 0;  // <<< переименовал для стихов

fetch(proxy)
  .then(res => res.text())
  .then(csv => {
    const lines = csv.split(/\r?\n/);

    let i = 1;
    while (i < lines.length) {
      let line = lines[i].trim();
      if (!line) { i++; continue; }

      let j = i + 1;
      while ((line.match(/"/g) || []).length % 2 !== 0 && j < lines.length) {
        line += "\n" + lines[j];
        j++;
      }

      let inQuotes = false;
      let commaIndex = -1;
      for (let k = 0; k < line.length; k++) {
        if (line[k] === '"') inQuotes = !inQuotes;
        if (line[k] === ',' && !inQuotes) { commaIndex = k; break; }
      }

      const title = line.slice(0, commaIndex).trim();
      let text = line.slice(commaIndex + 1).trim();
      if (text.startsWith('"') && text.endsWith('"')) text = text.slice(1, -1);
      text = text.replace(/,+$/g, '');

      poems.push({ title, text });
      i = j;
    }

    showPoem(currentPoemIndex);
  })
  .catch(err => {
    document.getElementById("poemTitle").innerText = "Ошибка загрузки";
    document.getElementById("poemText").innerText = "";
    console.error(err);
  });

function showPoem(index) {
  if (!poems.length) return;
  const poem = poems[index];
  document.getElementById("poemTitle").innerText = poem.title;
  document.getElementById("poemText").innerText = poem.text;
}

document.getElementById("prevBtn").addEventListener("click", () => {
  if (!poems.length) return;
  currentPoemIndex = (currentPoemIndex - 1 + poems.length) % poems.length;
  showPoem(currentPoemIndex);
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (!poems.length) return;
  currentPoemIndex = (currentPoemIndex + 1) % poems.length;
  showPoem(currentPoemIndex);
});


// ---------- Слайдер для картинок ----------
const sliderImages = [
  "assets/images/Frame 33.png",
  "assets/images/Frame 33(1).png",
  "assets/images/Frame 33(2).png",
  "assets/images/Frame 33(3).png"
];

let currentImageIndex = 0; // <<< отдельный индекс для картинок

const imgElement = document.querySelector(".fix");
const leftBtn = document.querySelector(".rate-btn-l button");
const rightBtn = document.querySelector(".rate-btn-r button");

function updateImage() {
  imgElement.src = sliderImages[currentImageIndex];
}

rightBtn.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex - 1 + sliderImages.length) % sliderImages.length;
  updateImage();
});




leftBtn.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex - 1 + sliderImages.length) % sliderImages.length;
  updateImage();
});

document.addEventListener("DOMContentLoaded", () => {

  const sliderData = [
    { main: '<img src="assets/images/case/Frame 51.png" alt="Слайд 1">', thumbs: ["assets/images/case/birbirpatapin1.png","assets/images/case/birbirpatapin2.png","assets/images/case/birbirpatapin3.png"] },
    { main: '<img src="assets/images/case/Frame 51.png" alt="Слайд 2">', thumbs: ["assets/images/case/image 3.png","assets/images/case/image 4.png","assets/images/case/image 5.png"] },
    { main: '<img src="assets/images/case/krokodilo1.png" alt="Слайд 3">', thumbs: ["assets/images/case/image 3 (1).png","assets/images/case/image 4 (1).png","assets/images/case/image 5 (1).png"] },
    { main: '<img src="assets/images/case/krokodilo.png" alt="Слайд 4">', thumbs: ["assets/images/case/image 3 (2).png","assets/images/case/image 4 (2).png","assets/images/case/image 5 (2).png"] },
    {
      main: `
    <div class="slide-container">
      <p>
        Хочеш приєднатись чи дізнатись більше? <br>
        Підпишись на мій 
        <a href="https://t.me/yourchannel" target="_blank">Telegram</a> 
        канал та сторінку в 
        <a href="https://instagram.com/yourpage" target="_blank">Instagram</a>!
      </p>
    </div>
  `,

      thumbs: ["assets/images/case/image 3 (3).png","assets/images/case/image 4 (3).png","assets/images/case/image 5 (3).png"]
    }
  ];

  let current = 0;
  const opq = document.querySelector(".opq");
  const thumbImgs = document.querySelectorAll(".img-block img");
  const dotsContainer = document.querySelector(".dots");
  const prevBtn = document.querySelector("#prev");
  const nextBtn = document.querySelector("#next");

  // создаём точки
  dotsContainer.innerHTML = "";
  sliderData.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => {
      current = i;
      updateSlider();
    });
    dotsContainer.appendChild(dot);
  });

  function updateSlider() {
    // вставляем HTML слайда
    opq.innerHTML = sliderData[current].main;

    // миниатюры
    sliderData[current].thumbs.forEach((src, i) => {
      if (thumbImgs[i]) thumbImgs[i].src = src;
    });

    // активные точки
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });
  }

  // кнопки
  nextBtn.addEventListener("click", () => {
    current = (current + 1) % sliderData.length;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    current = (current - 1 + sliderData.length) % sliderData.length;
    updateSlider();
  });

  // первый запуск
  updateSlider();
});
