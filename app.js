const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
require('dotenv').config(); // Для використання .env файлу


// --------------------
// 1. Дані кандидатів
// --------------------
const CANDIDATES_LIST = {
   "1": {
    "name": "Нишпорка Олена Іванівна",
    "ngo": "Антикорупційна сокира",
    "pdf": "public/candidates/Нишпорка.pdf"
  },
  "2": {
    "name": "Соловйов Микита Олександрович",
    "ngo": "Антикорупційна сокира",
    "pdf": "public/candidates/Соловйов.pdf"
  },
  "3": {
    "name": "Шуба Анастасія Вадимівна",
    "ngo": "Антикорупційна сокира",
    "pdf": "public/candidates/Шуба.pdf"
  },
  "4": {
    "name": "Романчук Андрій Богданович",
    "ngo": "Асоціація правників України",
    "pdf": "public/candidates/Романчук.pdf"
  },
  "5": {
    "name": "Бріт Ореста Павлівна",
    "ngo": "БОН",
    "pdf": "public/candidates/Бріт.pdf"
  },
  "6": {
    "name": "Русаков Сергій Олександрович",
    "ngo": "Бюро протидії корупції",
    "pdf": "public/candidates/Русаков.pdf"
  },
  "7": {
    "name": "Гудименко Юрій Володимирович",
    "ngo": "Ветеранська сокира",
    "pdf": "public/candidates/Гудименко.pdf"
  },
  "8": {
    "name": "Штанков Микита Володимирович",
    "ngo": "Ветеранська сокира",
    "pdf": "public/candidates/Штанков.pdf"
  },
  "9": {
    "name": "Акопян Рудольф Володимирович",
    "ngo": "Всеукраїнське бюро люстрації та протидії корупції / Бюро протидії корупції",
    "pdf": "public/candidates/Акопян.pdf"
  },
  "10": {
    "name": "Гришко Вероніка Віталіївна",
    "ngo": "Детектор влади",
    "pdf": "public/candidates/Гришко.pdf"
  },
  "11": {
    "name": "Юрченко Анна Ігорівна",
    "ngo": "Детектор влади",
    "pdf": "public/candidates/Юрченко.pdf"
  },
  "12": {
    "name": "Мельник Руслан Дмитрович",
    "ngo": "Захист-Є",
    "pdf": "public/candidates/Мельник.pdf"
  },
  "13": {
    "name": "Олівінський Олександр Вікторович",
    "ngo": "Київська спілка ветеранів війни з Росією",
    "pdf": "public/candidates/Олівінський.pdf"
  },
  "14": {
    "name": "Свинаренко Олексій Олександрович",
    "ngo": "Київська спілка ветеранів війни з Росією",
    "pdf": "public/candidates/Свинаренко.pdf"
  },
  "15": {
    "name": "Кутний Роман Антонович",
    "ngo": "Народний антикорупційний нагляд",
    "pdf": "public/candidates/Кутний.pdf"
  },
  "16": {
    "name": "Розум Олег Володимирович",
    "ngo": "Народний антикорупційний нагляд",
    "pdf": "public/candidates/Розум.pdf"
  },
  "17": {
    "name": "Левченко В’ячеслав Васильович",
    "ngo": "Національний антикорупційний центр України",
    "pdf": "public/candidates/Левченко.pdf"
  },
  "18": {
    "name": "Рибалко Тетяна Сергіївна",
    "ngo": "Національний антикорупційний центр України",
    "pdf": "public/candidates/Рибалко.pdf"
  },
  "19": {
    "name": "Плоска Ганна Віталіївна",
    "ngo": "Національний центр правозахисту",
    "pdf": "public/candidates/Плоска.pdf"
  },
  "20": {
    "name": "Пшеничний Давид Олександрович",
    "ngo": "Національний центр правозахисту",
    "pdf": "public/candidates/Пшеничний.pdf"
  },
  "21": {
    "name": "Яциняк Єлизавета Тарасівна",
    "ngo": "Національний центр правозахисту",
    "pdf": "public/candidates/Яциняк.pdf"
  },
  "22": {
    "name": "Костецький Максим Юрійович",
    "ngo": "Незалежна антикорупційна комісія",
    "pdf": "public/candidates/Костецький.pdf"
  },
  "23": {
    "name": "Ніколаєнко Тетяна Володимирівна",
    "ngo": "Незалежна антикорупційна комісія",
    "pdf": "public/candidates/Ніколаєнко.pdf"
  },
  "24": {
    "name": "Трегуб Олена Миколаївна",
    "ngo": "Незалежна антикорупційна комісія",
    "pdf": "public/candidates/Трегуб.pdf"
  },
  "25": {
    "name": "Корольов Ігор Сергійович",
    "ngo": "Разом проти корупції",
    "pdf": "public/candidates/Корольов.pdf"
  },
  "26": {
    "name": "Рябека Євгенія Олександрівна",
    "ngo": "Разом проти корупції",
    "pdf": "public/candidates/Рябека.pdf"
  },
  "27": {
    "name": "Слесаренко Євгеній Ігорович",
    "ngo": "Разом проти корупції",
    "pdf": "public/candidates/Слесаренко.pdf"
  },
  "28": {
    "name": "Осінчук Остап Мирославович",
    "ngo": "Спілка офіцерів України",
    "pdf": "public/candidates/Осінчук.pdf"
  },
  "29": {
    "name": "Мітєва Катерина Олександрівна",
    "ngo": "Стейтвотч",
    "pdf": "public/candidates/Мітєва.pdf"
  },
  "30": {
    "name": "Попович Інна Юріївна",
    "ngo": "Стейтвотч",
    "pdf": "public/candidates/Попович.pdf"
  },
  "31": {
    "name": "Біщук Віктор Павлович",
    "ngo": "Українське правниче товариство",
    "pdf": "public/candidates/Біщук.pdf"
  },
  "32": {
    "name": "Масюк Віталій Володимирович",
    "ngo": "Українське правниче товариство",
    "pdf": "public/candidates/Масюк.pdf"
  },
  "33": {
    "name": "Чернов Олег Валерійович",
    "ngo": "Українське правниче товариство",
    "pdf": "public/candidates/Чернов.pdf"
  },
  "34": {
    "name": "Калинчук Анна Сергіївна",
    "ngo": "Фундація ДЕЮРЕ",
    "pdf": "public/candidates/Калинчук.pdf"
  },
  "35": {
    "name": "Геращенко Олександр Володимирович",
    "ngo": "Центр протидії рейдерству та корупції",
    "pdf": "public/candidates/Геращенко.pdf"
  },
  "36": {
    "name": "Кривошея Геннадій Григорович",
    "ngo": "Центр протидії рейдерству та корупції",
    "pdf": "public/candidates/Кривошея.pdf"
  },
  "37": {
    "name": "Ярова Богдана Едуардівна",
    "ngo": "Центр протидії рейдерству та корупції",
    "pdf": "public/candidates/Ярова.pdf"
  },
  "38": {
    "name": "Даценко Катерина Андріївна",
    "ngo": "Центр суспільного контролю",
    "pdf": "public/candidates/Даценко.pdf"
  },
  "39": {
    "name": "Микитюк Антон Сергійович",
    "ngo": "Центр суспільного контролю",
    "pdf": "public/candidates/Микитюк.pdf"
  },
  "40": {
    "name": "Прудковських Віктор В’ячеславович",
    "ngo": "Центр суспільного контролю",
    "pdf": "public/candidates/Прудковських.pdf"
  }
};

// Додати ID до кожного кандидата і ініціалізувати історію голосів
Object.keys(CANDIDATES_LIST).forEach(id => {
  CANDIDATES_LIST[id].id = id;
  CANDIDATES_LIST[id].voteHistory = {};
});

// --------------------
// Кеш у пам’яті
// --------------------
let cacheData = {
  timestamp: null,
  candidates: [],
  voteTimestamps: []
};

// --------------------
// Функція оновлення голосів
// --------------------
function fetchAndUpdateVotes() {
  const PROTOCOL_URL = 'https://rgk.vote.mod.gov.ua/protocol.txt';

  https.get(PROTOCOL_URL, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Failed to fetch protocol. Status code: ${res.statusCode}`);
      return;
    }

    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      const votes = {};
      const voteTimestamps = [];

      try {
        const voteLines = data.split('\n').filter(line => line.includes('V='));
        voteLines.forEach(line => {
          const parts = line.split(/\s+/);
          const timestamp = new Date(parts[0] + ' ' + parts[1]);
          // Round down to the nearest 10 minutes
          timestamp.setMinutes(Math.floor(timestamp.getMinutes() / 10) * 10, 0, 0);
          const roundedTimestamp = timestamp.toISOString();
          const votePart = line.split('V=')[1];
          if (votePart) {
            const voteIds = votePart.split(',').map(id => id.trim());
            voteIds.forEach(id => {
              if (CANDIDATES_LIST[id]) {
                votes[id] = (votes[id] || 0) + 1;
                voteTimestamps.push({ timestamp: roundedTimestamp, id });
                if (!CANDIDATES_LIST[id].voteHistory[roundedTimestamp]) {
                  CANDIDATES_LIST[id].voteHistory[roundedTimestamp] = { votes: 0, cumulativeVotes: 0 };
                }
                CANDIDATES_LIST[id].voteHistory[roundedTimestamp].votes += 1;
                CANDIDATES_LIST[id].voteHistory[roundedTimestamp].cumulativeVotes = votes[id];
              }
            });
          }
        });

        // Оновлення кешу
        cacheData = {
          timestamp: new Date().toISOString(),
          candidates: Object.keys(CANDIDATES_LIST).map(id => ({
            ...CANDIDATES_LIST[id],
            votes: votes[id] || 0
          })),
          voteTimestamps
        };

        console.log('Cache updated successfully.');
      } catch (err) {
        console.error('Error parsing protocol data:', err);
      }
    });
  }).on('error', err => {
    console.error('Error fetching protocol:', err);
  });
}

// --------------------
// Запуск оновлення та інтервал
// --------------------
fetchAndUpdateVotes();
setInterval(fetchAndUpdateVotes, 600000); // Оновлювати кожні 10 хвилин

// --------------------
// Створення Express App
// --------------------
const app = express();

// Віддаємо статичні файли
app.use(express.static(path.join(__dirname, 'public')));

// API маршрут для даних
app.get('/api/stats', (req, res) => {
  res.json(cacheData);
});

// Експорт для запуску
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});