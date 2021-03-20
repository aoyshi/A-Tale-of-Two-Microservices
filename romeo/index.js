const express = require('express');
const { randomBytes } = require('crypto');

const app = express();
app.use(express.json());

const PORT = 3001;
const rocks = [];

// Routes
app.get('/romeo/rocks', (req, res) => {
  res.status(200).send(`All rocks thrown: ${JSON.stringify(rocks)}`);
});

app.post('/romeo/rocks/throw', (req, res) => {
  const { size, time } = req.body;
  const id = randomBytes(4).toString('hex');
  rocks.push({ id, size, time });

  res.status(201).send(`Romeo threw a ${size} rock at Juliet's window during the ${time}.`);
});

app.listen(PORT, () => {
  console.log(`Romeo waiting at ${PORT}...`)
});
