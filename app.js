Object.keys(CANDIDATES_LIST).forEach(id => {
    CANDIDATES_LIST[id].id = id;
});

const fetchAndUpdateVotes = () => {
    https.get(PROTOCOL_URL, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
            try {
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

                const voteResults = Object.keys(CANDIDATES_LIST).reduce((acc, id) => {
                    acc[id] = {
                        id,
                        ...CANDIDATES_LIST[id],
                        votes: votes[id] || 0
                    };
                    return acc;
                }, {});

                const updatedData = {
                    timestamp: new Date().toISOString(),
                    totalVotes,
                    uniqueVoters: uniqueVoters.size,
                    candidates: voteResults
                };

                fs.writeFileSync(CACHE_FILE, JSON.stringify(updatedData, null, 2));
            } catch (err) {
                console.error('Помилка обробки даних:', err);
            }
        });
    }).on('error', err => console.error('Помилка запиту:', err));
};

setInterval(fetchAndUpdateVotes, 10 * 60 * 1000);
fetchAndUpdateVotes();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/data', (req, res) => {
    if (fs.existsSync(CACHE_FILE)) {
        try {
            const cachedData = fs.readFileSync(CACHE_FILE, 'utf-8');
            res.json(JSON.parse(cachedData));
        } catch (err) {
            console.error('Помилка читання кешу:', err);
            res.status(500).json({ error: 'Помилка читання кешу' });
        }
    } else {
        res.status(503).json({ error: 'Дані ще не готові. Спробуйте пізніше.' });
    }
});

module.exports = app;