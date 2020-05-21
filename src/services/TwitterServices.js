const {twitterConfig} = require('../../config')
const Twit = require('twit')
const _ = require('lodash')

class TwitterServices {

    constructor(twitterService) {
        this.twitterService = twitterService
    }

    tweeted(err, data, response) {
        console.log(data)
    }

    async postTweet(msg) {
        //has tweet existed before?
        const tweet = {
            status: msg
        }
        this.twitterService.post('statuses/update', tweet, this.tweeted)
    }

    async hasBeenTweetedBefore(jobUrl) {
        //key is job url
        const historicalTweets = await this.getHistoricalTweets()
        //lets hope api doesnt change :)
        //some algo expert fix this
        const tweetTextArray = historicalTweets.map((tweetData) =>_.get(tweetData,'entities.urls[0].expanded_url', '')  )
        const validationArray = tweetTextArray.filter((url)=>{
           return url===jobUrl
        }) || []

        return validationArray.length >0
    }

    async getHistoricalTweets() {
        const response = await this.twitterService.get('statuses/user_timeline', {screen_name: 'tloz_tlotr'})
        const {data = []} = response
        return data
    }

    static async fromConfig() {
        const twitterService = new Twit(twitterConfig)
        return new TwitterServices(twitterService)
    }

}

module.exports = TwitterServices
