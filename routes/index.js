var express = require('express');
var router = express.Router();
const CompanyInfo = require('../src/data/CompanyInfo')
const TwitterServices = require('../src/services/TwitterServices')


function generateTweet(companyName, hashTags = []) {
    const companyData = CompanyInfo
    const hashTagList = hashTags.join(' ')
    const data = companyData.find((company) => company.name === companyName)
    if (data) {
        const template = `Job Alert at ${data.name}: Android Engineer ${data.twitterHandle} \nhttps://corp.flipp.com/jobs?gh_jid=2113841 \n ${hashTagList}`
        return template
    } else {
        return null
    }
}

router.get('/tweet-job', async function (req, res, next) {
    const twitterService = await TwitterServices.fromConfig()

    const hashTags = ['#FindJobsTO', '#Android', '#jobs', "#Engineer", '#toronto']

    try {
        const tweet = generateTweet('Flipp', hashTags)
        if (!tweet) return
        await twitterService.postTweet(tweet)
        res.json(tweet)

    } catch (e) {
        res.json(e.message)
    }
});


module.exports = router;
