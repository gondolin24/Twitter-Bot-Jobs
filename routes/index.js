var express = require('express');
var router = express.Router();
const CompanyInfo = require('../src/data/CompanyInfo')
const TwitterServices = require('../src/services/TwitterServices')
const WebScrapperService = require('../src/services/WebScrapperService')

function getCompanyInfo(companyName) {
    const companyData = CompanyInfo
    const data = companyData.find((company) => company.name === companyName)
    return data
}


function generateTweet(companyName, hashTags = [], jobUrl, title) {
    const hashTagList = hashTags.join(' ')
    const data = getCompanyInfo(companyName)

    if (data) {
        const template = `Job Alert at ${data.name}: ${title} ${data.twitterHandle} \n\n${jobUrl} \n\n ${hashTagList}`
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
    interval = await didTweet()
    res.json('bot-started')
})
router.get('/stop-bot', async function (req, res, next) {
    clearInterval(interval)
    res.json('bot stopped')
})

async function didTweet() {
    const twitterService = await TwitterServices.fromConfig()
    const web = await WebScrapperService.service()

    const companyName = 'Wealthsimple'
    const hashTags = ['#FindJobsTO', '#Software', '#jobs', "#Engineer", '#toronto', '#coding', `#${companyName}`]

    const companyData = getCompanyInfo(companyName)
    const companyOpenings = await web.getOpeningsAtCompany(companyData.baseUrl)
    for (let opening of companyOpenings) {
        const {url, jobName} = opening
        const hasBeenTweetedBefore = await twitterService.hasBeenTweetedBefore(url)
        if (!hasBeenTweetedBefore) {
            const tweet = generateTweet(companyName, hashTags, url, jobName)
            await twitterService.postTweet(tweet)
            break
        }
    }

    return true
}

module.exports = router;
