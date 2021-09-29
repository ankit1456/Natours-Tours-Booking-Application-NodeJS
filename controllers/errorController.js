const AppError = require('./../utils/appError');

//? (((((((((((((((((((   HANDLE INVALID DOCUMENTS IDs   )))))))))))))))))))

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//? (((((((((((((((((((   HANDLE DUPLICATE DB FIELD VALUES   )))))))))))))))))))

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

//? (((((((((((((((((((   MONGOOSE VALIDATION ERRORS   )))))))))))))))))))

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `${errors.join('. ')}`;

  return new AppError(message, 400);
};

//? (((((((((((((((((((   HANDLE JWT ERRORS   )))))))))))))))))))

const handleJWTError = () =>
  new AppError('You are not logged in . Please log in to get access ', 401);

const handleJWTExpiredError = () => {
  return new AppError('Your credentials have been expired .Please log in again', 401);
};

//? (((((((((((((((((((   SEND ERROR IN DEVELOPMENT   )))))))))))))))))))

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // API
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }
  // RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message
  });
};

//? (((((((((((((((((((   SEND ERROR IN PRODUCTION   )))))))))))))))))))

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log('ERROR 💥', err.message);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.'
  });
};

//? (((((((((((((((((((   GLOBAL ERROR HANDLER   )))))))))))))))))))

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = err ; // does't give name property
    // let error = Object.assign(err); //it will give a reference of err and  that's not we want
    // let error = JSON.parse(JSON.stringify(err)); //deep cloning of err
    // let error = Object.create(err); //assigning all properties of err to error

    let error = { ...err };
    error.name = err.name;
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
