/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      minLength: 6,
      required: true,
      columnName: 'encryptedPassword'
    },
  },
  customToJSON: function(){
      return _.omit(this, ['password']);
      },

  beforeCreate: function(values, cb) {
    bcrypt.hash(values.password, 10, function (error, hash) {
      if (error) return cb(error);
      values.password = hash;
      cb()
    });
  },

    comparePassword: function(password, user) {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password,user.password, (error, match)=>{
          if (error) reject(error);

          if (match) {
            resolve(true);
          }else {
            reject(error);
          }
        });
      });
    }

};

