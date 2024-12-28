// app.js
const https = require('https');
const express = require('express');
const path = require('path');

// --------------------
// 1. Дані кандидатів
// --------------------
const CANDIDATES_LIST = {
  "1": { name: "Нишпорка Олена Іванівна", ngo: "Антикорупційна сокира", pdf: "public/candidates/Нишпорка.pdf" },
  "2": { name: "Соловйов Микита Олександрович", ngo: "Антикорупційна сокира", pdf: "public/candidates/Соловйов.pdf" },
  "3": { name: "Шуба Анастасія Вадимівна", ngo: "Антикорупційна сокира", pdf: "public/candidates/Шуба.pdf" },
  "4": { name: "Романчук Андрій Богданович", ngo: "Асоціація правників України", pdf: "public/candidates/Романчук.pdf" },
  "5": { name: "Бріт Ореста Павлівна", ngo: "БОН", pdf: "public/candidates/Бріт.pdf" },
  "6": { name: "Русаков Сергій Олександрович", ngo: "Бюро протидії корупції", pdf: "public/candidates/Русаков.pdf" },
  "7": { name: "Гудименко Юрій Володимирович", ngo: "Ветеранська сокира", pdf: "public/candidates/Гудименко.pdf" },
  "8": { name: "Штанков Микита Володимирович", ngo: "Ветеранська сокира", pdf: "public/candidates/Штанков.pdf" },
  "9": { name: "Акопян Рудольф Володимирович", ngo: "Всеукраїнське бюро люстрації та протидії корупції / Бюро протидії корупції", pdf: "public/candidates/Акопян.pdf" },
  // ... решту так само ...
  "40": { name: "Прудковських Віктор В’ячеславович", ngo: "Центр суспільного контролю", pdf: "public/candidates/Прудковських.pdf" }
};

// Трошки «притерти» ключі, щоб було зручніше в коді
Object.keys(CANDIDATES_LIST).forEach(id => {
  CANDIDATES_LIST[id].id = parseInt(id, 10);
});

// --------------------
// 2. Кеш у пам’яті
// --------------------
let cacheData = {
  timestamp: null,
  totalVotes: 0,
  uniqueVoters: 0,
  candidates: {}
};

// --------------------
// 3. Функція оновлення
// --------------------
function fetchAndUpdateVotes() {
  // RGK-URL
  const PROTOCOL_URL = 'https://rgk.vote.mod.gov.ua/protocol.txt';
  
  https.get(PROTOCOL_URL, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      // Можливо, треба підлаштувати під реальний формат "protocol.txt"
      const voteLines = data.split('\n').filter(line => line.includes('V='));
      const votes = {};
      const uniqueVoters = new Set(); 
      let totalVotes = 0;

      voteLines.forEach(line => {
        const voterIdMatch = line.match(/N=([A-Za-z0-9]+)/); 
        if (voterIdMatch) {
          uniqueVoters.add(voterIdMatch[1]); 
        }

        const votePart = line.split('V=')[1];
        if (votePart) {
          const voteIds = votePart.split(',').map(id => id.trim());
          voteIds.forEach(id => {
            votes[id] = (votes[id] || 0) + 1;
            totalVotes++;
          });
        }
      });

      // Зібрати нові дані у зручному вигляді
      const candidates = {};
      Object.keys(CANDIDATES_LIST).forEach((id) => {
        candidates[id] = {
          ...CANDIDATES_LIST[id],
          votes: votes[id] || 0
        };
      });

      // Записати у змінну
      cacheData = {
        timestamp: new Date().toISOString(),
        totalVotes,
        uniqueVoters: uniqueVoters.size,
        candidates
      };
    });
  }).on('error', err => console.error('Error fetching protocol:', err));
}

// --------------------
// 4. Запустити перше оновлення + інтервал
// --------------------
fetchAndUpdateVotes();
// Кожні 10 хв оновлюємо (при бажанні можна частіше/рідше)
setInterval(fetchAndUpdateVotes, 600000);

// --------------------
// 5. Створюємо express app
// --------------------
const app = express();

// Додаємо можливість віддавати статичні файли з папки `public`
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут, що повертає JSON із кеша
app.get('/data', (req, res) => {
  res.json(cacheData);
});

// Для Vercel: експортуємо `app` як модуль
module.exports = app;
