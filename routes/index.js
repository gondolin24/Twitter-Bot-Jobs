var express = require('express');
var router = express.Router();
const Twit = require('twit')
const {twitterConfig} = require('../config')

const T = new Twit(twitterConfig)

function tweeted(err, data, response){
  console.log(data)
}
function generateTweet(){
  const tweet = {
    status : "Job Alert: Engineering Manager @JoinLeague \nhttps://jobs.lever.co/league/ee4f84d4-4f8e-45c3-9b66-a850169bd206 \n #FindJobsTO"
  }
  T.post('statuses/update', tweet, tweeted)
}


router.get('/tweet-job', function(req, res, next) {
  try{
    generateTweet()
    res.json({status: 'Tweet Succssful '})

  }catch{
    res.json({status: 'fail'})
  }
});


module.exports = router;
