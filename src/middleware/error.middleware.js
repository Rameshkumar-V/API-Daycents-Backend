module.exports = (err, req, res, next) => {
  console.error(err.stack);  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.log("ERROR MIDDLEWARE : "+ err.message)
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
