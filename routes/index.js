var express = require('express');
var router = express.Router();
const Twit = require('twit')
const {twitterConfig} = require('../config')
const CompanyInfo = require('../src/data/CompanyInfo')

const T = new Twit(twitterConfig)

function tweeted(err, data, response) {
    console.log(data)
}

function generateTweet(company, position, website) {
    const companyData = JSON.parse(CompanyInfo)
    const data = companyData.find((company) => company === companyData.name)
    if (data) {
        const template = `Job Alert: Senior Java Engineer ${data.twitterHandle} at ${data.name} \nhttps://jobs.lever.co/wealthsimple/55b4a81e-39d7-4cde-b1e0-2c1c654eff3e \n #FindJobsTO`
        return template
    } else {
        //add error handling
    }
}

function tweet() {
    const tweet = {
        status: "Job Alert at Wealthsimple: Senior Java Engineer @Wealthsimple \nhttps://jobs.lever.co/wealthsimple/55b4a81e-39d7-4cde-b1e0-2c1c654eff3e \n #FindJobsTO"
    }
    T.post('statuses/update', tweet, tweeted)
}


router.get('/tweet-job', function (req, res, next) {
    try {
        tweet()
        res.json({status: 'pass'})

    } catch {
        res.json({status: 'fail'})
    }
});


module.exports = router;
