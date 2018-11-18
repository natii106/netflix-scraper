const express = require('express');
const app = require('./app');
const router = express.Router();

const login = require('./login');


router.get("/login", async (req, res)  =>{

  await login.main();
  console.log('nw');

});


module.exports = router;
