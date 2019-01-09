module.exports = function (req, res, next) {
  let token;
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      const scheme = parts[0], credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }

    } else {
      return ResponseService.json(401, res, "Format is Authorization: Bearer[token]");
    }
  } else if (req.param('token')) {
    token = req.param('token');
    delete req.query('token');
  } else {
    return ResponseService.json(401, res, "No authorization header was found");
  }

  JwtService.verify(token, async function (error, decoded) {
    if (error) return ResponseService.json(401, res, "invalid token");
    req.token = token;

    try {
      const user = await User.findone({id: decoded.id}).fetch();
      req.current_user = user;
      next();
    }catch(error){

      return ResponseService.json(401, res, "Invalid token");
    }
  })
};
