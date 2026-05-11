const success = (res, data, message = "Success") => {
  return res.json({
    success: true,
    message,
    data,
  });
};

const error = (res, message = "Error", code = 500) => {
  return res.status(code).json({
    success: false,
    message,
  });
};

module.exports = {
  success,
  error,
};