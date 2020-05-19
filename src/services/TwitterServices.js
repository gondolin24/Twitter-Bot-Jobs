const {twitterConfig} = require('../../config')
const Twit = require('twit')

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

    async getAllTweets() {
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
