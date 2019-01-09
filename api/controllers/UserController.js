/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const _ = require('lodash');
module.exports = {

  create: async function (req, res) {
    if (req.body.password !== req.body.confirmPassword) {
      return ResponseService.json(401, res, "Password doesn't match");
    }

    const allowedParameters = ["email", "password"];
    const data = _.pick(req.body, allowedParameters);

    try {
      const user = await User.create(data).fetch();
      if (!user) return ResponseService.json(400, res, "User could not be created");
      const responseData = {
        user: user,
        token: JwtService.issue({id: user.id})
      };

      return ResponseService.json(200, res, "User created successfully", responseData);

    } catch (error) {
      return ResponseService.json(500, res, "User could not be created", error);
    }

  }
};

