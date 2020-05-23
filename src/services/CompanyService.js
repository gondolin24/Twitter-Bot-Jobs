const CompanyInfo = require('../data/CompanyInfo')

class CompanyService {

    getCompanyInfo(companyName) {
        const companyData = CompanyInfo
        const data = companyData.find((company) => company.name === companyName)
        return data
    }

    selectRandomCompanyName() {
        const availableCompanies = Array.from(CompanyInfo).map((company) => company.name)
        const randomIndex = Math.floor(Math.random() * availableCompanies.length)
        return availableCompanies[randomIndex]
    }

    selectRandomCompany(){
        const companyName = this.selectRandomCompanyName()
        return this.getCompanyInfo(companyName)
    }

}

module.exports = CompanyService
