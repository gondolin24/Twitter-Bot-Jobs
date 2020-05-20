var express = require('express');
var router = express.Router();
const CompanyInfo = require('../src/data/CompanyInfo')
const TwitterServices = require('../src/services/TwitterServices')


function generateTweet(companyName, hashTags = []) {
    const companyData = CompanyInfo
    const hashTagList = hashTags.join(' ')
    const data = companyData.find((company) => company.name === companyName)
    if (data) {
        const template = `Job Alert at ${data.name}: Software Engineer, IOS ${data.twitterHandle} \n\nhttps://slack.com/intl/en-ca/careers/2087876/software-engineer-ios \n\n ${hashTagList}`
        return template
    } else {
        return null
    }
}

function logme() {
    console.log('bot-running')
}

let interval
router.get('/run-bot', async function (req, res, next) {
    interval = setInterval(logme, 4000)
    res.json('bot-started')
})
router.get('/stop-bot', async function (req, res, next) {
    clearInterval(interval)
    res.json('bot stopped')
})


router.get('/tweet-job', async function (req, res, next) {
    const twitterService = await TwitterServices.fromConfig()

    const hashTags = ['#FindJobsTO', '#IOS', '#jobs', "#Engineer", '#toronto', '#Xcode']

    try {
        const tweet = generateTweet('Slack', hashTags)
        if (!tweet) return
        await twitterService.postTweet(tweet)
        res.json(tweet)

    } catch (e) {
        res.json(e.message)
    }
});


module.exports = router;
