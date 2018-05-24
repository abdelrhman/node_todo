const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
var message = 'I am a test message';
var hash = SHA256(message).toString();

//jwt.sign()
//jwt.verify()

console.log(message);

console.log(hash);
