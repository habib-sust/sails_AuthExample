module.exports = {
  json: (status, res, message, data, meta) => {
    let response = {
      response: {
        message: message
      }
    };

    if (typeof data !== 'undefined') response.response.data = data;
    if (typeof meta !== 'undefined') response.response.meta = meta;

    return res.status(status).json(response);
  }
};
