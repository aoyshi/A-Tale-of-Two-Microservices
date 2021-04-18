const express = require('express');
const { randomBytes } = require('crypto');
const { default: axios } = require('axios');

const app = express();
app.use(express.json());

const PORT = 3001;
const rocks = [];

// Routes
app.get('/romeo/rocks', (req, res) => {
  res.status(200).send(rocks);
});

app.post('/romeo/rocks/throw', async (req, res) => {
  const { size, time } = req.body;
  const id = randomBytes(4).toString('hex');
  const rock = { id, size, time };
  rocks.push(rock);

  const event = { type: 'rockThrown', data: rock };
  await axios.post('http://juliet-srv:3002/juliet/taptap', event);

  res.status(201).send(`Romeo threw a ${size} rock at Juliet's window during the ${time}.`);
});

app.listen(PORT, () => {
  console.log(`Romeo waiting at ${PORT}...`)
});
