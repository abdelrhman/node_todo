const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var message = 'I am a test message';
var hash = SHA256(message).toString();

var password = 'abc123';
//
// bcrypt.genSalt(10, (err, saltValue) => {
//   bcrypt.hash(password, saltValue, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword =
  '$2a$10$3Ftd0hCXXJqo74ajGLO6A.8ElCR1QDy5BwKPP8TaldutHwWvalpC.';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});

//jwt.sign()
//jwt.verify()
//
// console.log(message);
//
// console.log(hash);
