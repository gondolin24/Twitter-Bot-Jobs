var express = require('express');
var router = express.Router();
const CompanyInfo = require('../src/data/CompanyInfo')
const TwitterServices = require('../src/services/TwitterServices')


function generateTweet(companyName, hashTags = [], jobUrl) {
    const companyData = CompanyInfo
    const hashTagList = hashTags.join(' ')
    const data = companyData.find((company) => company.name === companyName)
    if (data) {
        const template = `Job Alert at ${data.name}: Software Engineer, IOS ${data.twitterHandle} \n\n${jobUrl} \n\n ${hashTagList}`
        return template
    } else {
        return null
    }
}

async function runner() {
    const succesfulTweet = await didTweet()
    if (succesfulTweet)
        console.log('tweeted')
    else
        console.log('error or duplicate')
}

let interval
router.get('/run-bot', async function (req, res, next) {
    interval = setInterval(runner, 4000)
    res.json('bot-started')
})
router.get('/stop-bot', async function (req, res, next) {
    clearInterval(interval)
    res.json('bot stopped')
})

async function didTweet() {
    const twitterService = await TwitterServices.fromConfig()
    const hashTags = ['#FindJobsTO', '#API', '#jobs', "#Engineer", '#toronto', '#MongoDB', '#coding']
    const jobUrl = 'https://jobs.lever.co/wish/4c0bef08-2efe-4023-a51d-9dd75cc93099'
    const tweet = generateTweet('Wish', hashTags, jobUrl)

    const tweetInHistory = await twitterService.hasBeenTweetedBefore(jobUrl)
    if (!tweet || tweetInHistory) return false

    if (!tweetInHistory)
        await twitterService.postTweet(tweet)
    return true
}

module.exports = router;
