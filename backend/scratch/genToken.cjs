const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret_key';
const payload = { id: 'admin-id', role: 'admin' };
const token = jwt.sign(payload, secret);
console.log(token);
