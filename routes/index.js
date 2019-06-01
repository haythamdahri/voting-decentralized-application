const express = require('express');
const Cookies = require('cookies');
const sha512 = require('js-sha512');
const User = require('../models/user');
const router = express.Router();

// Cookies keys
let keys = ['email', 'password'];

/*
 *  Handle GET request for => /
 */

router.get('/', (req, res) => {
  // Create a cookies object
  var cookies = new Cookies(req, res, { keys: keys });

  // Retrieve cookies
  let email = cookies.get('email');
  let password = cookies.get('password');
  if (email == null || password == null) {
    res.redirect('/login');
  } else {
    res.render('index', { user: user });
  }
});

/*
 *  Handle GET request for => /login
 */

router.get('/login', (req, res) => {
  // Create a cookies object
  var cookies = new Cookies(req, res, { keys: keys });

  // Retrieve cookies
  let email = cookies.get('email');
  let password = cookies.get('password');
  if (email != null && password != null) {
    res.redirect('/');
  }

  // Render login html page
  let user = new User('', '', '');
  res.render('login', { user: user });
});

/*
 *  Handle POST request for => /
 */

router.post('/login', (req, res) => {
  // Retrieve request data
  console.log(req);
  let email = req.body.email;
  let password = req.body.password;

  // Create a cookies object
  var cookies = new Cookies(req, res, { keys: keys });

  // Set cookies + check user on the blockchain data + hash password before storing it
  cookies.set('email', email);
  var passwordHash = sha512.update(password);
  passwordHash = passwordHash.hex();
  cookies.set('password', passwordHash);
  console.log(passwordHash);
  res.redirect('/');
});

// Export the router
module.exports = router;
