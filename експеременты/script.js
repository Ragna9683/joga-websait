
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRKK14xunqKwibvmHl9u1sqPHaehOxw5UahYllTH17UvaL-ystf6ipa7ciWSYRWyLw8xhqbGBaD92Xe/pub?output=csv";
const proxy = "https://api.allorigins.win/raw?url=" + encodeURIComponent(sheetUrl);

let poems = [];
let currentIndex = 0;

fetch(proxy)
  .then(res => res.text())
  .then(csv => {
    const lines = csv.split(/\r?\n/);

    // Пропускаем заголовок и объединяем строки стихов с переносами
    let i = 1;
    while (i < lines.length) {
      let line = lines[i].trim();
      if (!line) { i++; continue; }

      let j = i + 1;
      while ((line.match(/"/g) || []).length % 2 !== 0 && j < lines.length) {
        line += "\n" + lines[j];
        j++;
      }

      // Находим первую запятую вне кавычек
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

    showPoem(currentIndex);
  })
  .catch(err => {
    document.getElementById("poemTitle").innerText = "Ошибка загрузки";
    document.getElementById("poemText").innerText = "";
    console.error(err);
  });

// Показываем стих по индексу
function showPoem(index) {
  if (!poems.length) return;
  const poem = poems[index];
  document.getElementById("poemTitle").innerText = poem.title;
  document.getElementById("poemText").innerText = poem.text;
}

// Кнопки листания
document.getElementById("prevBtn").addEventListener("click", () => {
  if (!poems.length) return;
  currentIndex = (currentIndex - 1 + poems.length) % poems.length;
  showPoem(currentIndex);
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (!poems.length) return;
  currentIndex = (currentIndex + 1) % poems.length;
  showPoem(currentIndex);
});
