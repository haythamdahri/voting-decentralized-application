const express = require('express');
const Cookies = require('cookies');
const sha512 = require('js-sha512');
const User = require('../models/user');
const forEachAsync = require('foreachasync');
const { toAscii, candidateStatistics } = require('../utils/functions');
const {
  bankingContractInstance,
  votingContractInstance,
  web3
} = require('../services/blockchain');
const router = express.Router();

// Cookies keys
let keys = ['address'];

/*
 *  Handle GET request for => /login
 */

router.get('/login', (req, res) => {
  // Create a cookies object
  var cookies = new Cookies(req, res, { keys: keys });

  // Add error message
  if (req.query.error != undefined) {
    console.log(req.params);
    req.flash('loginError', "L'adresse utilisée n'est pas valide!");
  }

  // Retrieve cookies
  let address = cookies.get('address', { signed: true });

  if (address != undefined) {
    res.redirect('/banking');
  } else {
    // Render login html page
    res.render('login', { address: null, message: req.flash('loginError') });
  }
});

/*
 *  Handle POST request for => /login
 */
router.post('/login', (req, res) => {
  // Retrieve request data
  let address = req.body.address.toLowerCase();

  // Create a cookies object
  var cookies = new Cookies(req, res, { keys: keys });

  // Chech if account exists
  let found = false;
  let accounts = web3.eth.accounts;
  console.log('Address: ' + address);
  for (let i = 0; i < accounts.length; i++) {
    console.log(accounts[i]);
    if (accounts[i] == address) {
      // Set cookies + check address on the blockchain
      cookies.set('address', address, { signed: true });
      found = true;
      break;
    }
  }
  if (found) {
    res.redirect('/banking');
  } else {
    res.redirect('/login?error');
  }
  // });
});

/*
 *  Handle GET request for => /banking
 */
router.get('/banking', (req, res) => {
  // Create a cookies object
  var cookies = new Cookies(req, res, { keys: keys });

  if (req.query.success != undefined) {
    req.flash('successMessage', 'La transsaction est éffectuée avec succé!');
  }

  // Retrieve cookies
  let address = cookies.get('address', { signed: true });

  if (address == undefined) {
    res.redirect('/login');
  } else {
    bankingContractInstance.getBalance((error, balance) => {
      res.render('banking', {
        address: address,
        balance: balance,
        message: req.flash('successMessage')
      });
    });
  }
});

/*
 *  Handle POST request for => /banking
 */
router.post('/banking', (req, res) => {
  // Create a cookies object
  var cookies = new Cookies(req, res, { keys: keys });

  // Retrieve amount from request body
  let amount = req.body.amount;

  // Retrieve cookies
  let address = cookies.get('address');

  // Check if user is authenticated
  if (address == undefined) {
    res.redirect('/login');
  } else {
    bankingContractInstance.getBalance((error, balance) => {
      if (Number(balance) > Number(amount)) {
        bankingContractInstance.deposit(
          Number(req.body.amount),
          {
            from: web3.eth.accounts[0]
          },
          (error, transaction) => {
            res.redirect('/banking?success');
          }
        );
      } else {
        res.redirect('/banking');
      }
    });
  }
});

/*
 *  Handle GET request for => /logout
 */
router.get('/logout', (req, res) => {
  // Redirect use to home
  res.redirect('/');
});

/*
 *  Handle POST request for => /logout
 */
router.post('/logout', (req, res) => {
  // Create a cookies object
  var cookies = new Cookies(req, res, { keys: keys });

  // Destroy session
  cookies.set('address', { maxAge: Date.now() });

  // redirect user to login page
  res.redirect('/login');
});

/*
 *  Handle GET request for => /
 */
router.get('/', (req, res) => {
  // Create a cookies object
  var cookies = new Cookies(req, res, { keys: keys });

  // Retrieve cookies
  let address = cookies.get('address', { signed: true });

  if (address == undefined) {
    res.redirect('/login');
  } else {
    // Retrieve candidats list from blockchain
    let candidatesNamesHex = votingContractInstance.getCandidateList();

    // Convert candidates hex code to string
    let candidates = new Array();
    let i = 0;

    forEachAsync
      .forEachAsync(candidatesNamesHex, item => {
        candidateStatistics(votingContractInstance, item).then(statistics => {
          candidates.push(statistics);
        });
      })
      .then(() => {
        // Send response to user
        res.setHeader('Content-Type', 'application/json');
        res.send(candidates);
      });

    // candidatesNamesHex.forEach(candidate => {
    //   candidateStatistics(votingContractInstance, candidate).then(
    //     (statistics) => {
    //       candidates.push(statistics);
    //     }
    //   )
    // });
  }
});

/*
 *  Handle POST request for => /
 */
router.post('/', (req, res) => {
  // Create a cookies object
  var cookies = new Cookies(req, res, { keys: keys });

  // Retrieve amount from request body
  let amount = req.body.amount;

  // Retrieve cookies
  let address = cookies.get('address');

  // Check if user is authenticated
  if (address == undefined) {
    res.redirect('/login');
  } else {
    bankingContractInstance.getBalance((error, balance) => {
      if (Number(balance) > Number(amount)) {
        bankingContractInstance.deposit(
          Number(req.body.amount),
          {
            from: web3.eth.accounts[0]
          },
          (error, transaction) => {
            res.redirect('/banking?success');
          }
        );
      } else {
        res.redirect('/banking');
      }
    });
  }
});

// Export the router
module.exports = router;
