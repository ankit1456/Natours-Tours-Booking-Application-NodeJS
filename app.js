const express = require('express');
const dotenv = require('dotenv');

const app = express();

app.get('/', (req, res) => {
  res.status(200).end('Hello from the server !');
});

const port = 8000;
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
