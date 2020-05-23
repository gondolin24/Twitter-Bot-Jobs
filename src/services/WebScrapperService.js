const puppeteer = require('puppeteer')

class WebScrapperService {

    async getSoftwareOpenings(page) {
        const data = await page.evaluate(async () => {
            const jobPostings = document.querySelectorAll('.posting-title')
            return  Array.from(jobPostings).map((value) => {
                const jobName = value.querySelector('h5')
                const url = value.getAttribute('href')
                return {
                    url,
                    jobName: jobName.textContent
                }
            })

        })

        return data.filter((posting) => {
            const {jobName = ''} = posting
            return jobName.toLowerCase().includes('product')|| jobName.toLowerCase().includes('software') || jobName.toLowerCase().includes('engineer') || jobName.toLowerCase().includes('engineering') || jobName.toLowerCase().includes('developer')
        })
    }

    async getOpeningsAtCompany(jobUrl) {
        const browser = await puppeteer.launch({headless: true})
        const page = await browser.newPage()
        await page.goto(jobUrl)

        const softwareOpenings = await this.getSoftwareOpenings(page)
        await browser.close()
        return softwareOpenings
    }

    static async service() {
        return new WebScrapperService()
    }
}

module.exports = WebScrapperService
