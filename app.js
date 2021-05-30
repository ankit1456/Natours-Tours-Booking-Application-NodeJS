const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//!  MIDDLEWARES **********************************
app.use(morgan('dev'));

app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋👋');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//TODO: ROUTE HANDLERS ********************************

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//! LISTENER********************************
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

module.exports = app;
