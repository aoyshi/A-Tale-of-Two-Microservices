const express = require('express');
const { randomBytes } = require('crypto');

const app = express();
app.use(express.json());

const PORT = 3002;
const windows = [];

app.get('/juliet/windows', (req, res) => {
  res.status(200).send(windows);
});

app.post('/juliet/taptap', (req, res) => {
  const { type, data } = req.body;
  const id = randomBytes(4).toString('hex');

  if (type === 'rockThrown') {
    const window = { id, open: true, time: data.time };
    windows.push(window);
  }

  res.status(200).send({});
});

app.listen(PORT, () => {
  console.log('Juliet waiting at 3002...');
});
