/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  login: async function (req, res) {
    const email = req.param('email');
    const password = req.param('password');
    verifyParams(res, email, password);

    try {
      const user = await User.findOne({email: email});
      if (!user) return invalidEmailOrPassword(res);

      signInUser(req, res, password, user);
    }catch(error) {

      console.log("Error: "+error);
      return invalidEmailOrPassword(res);
    }

  }

};

function signInUser(req, res, password, user) {
  User.comparePassword(password, user)
    .then(valid => {
      if (!valid) return invalidEmailOrPassword(res);
      const responseData = {
        user: user,
        token: generateToken(user.id)
      };
      return ResponseService.json(200, res, "Successfully sign in", responseData);
    })
    .catch(error => {

      console.log("Error: "+error);
      return ResponseService.json(403, res, "Forbidden", error);
  })
}

function invalidEmailOrPassword(res) {
  return ResponseService.json(401, res, "Invalid email or password");
}

function verifyParams(res, email, password) {
  if (!email || !password) return ResponseService.json(401, res, "Email & password required");
}

function generateToken(user_id) {
  return JwtService.issue({id: user_id});
}
