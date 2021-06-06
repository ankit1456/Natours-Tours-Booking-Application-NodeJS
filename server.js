const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log('DATABASE CONNECTED SUCCESSFULLY 😀😀');
  })
  .catch(err => {
    console.log(err.message);
  });

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
