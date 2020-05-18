var express = require('express');
var router = express.Router();
const Twit = require('twit')
const {twitterConfig} = require('../config')

const T = new Twit(twitterConfig)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
