import Api from './api.js'
const conf = window.appConf
import jsonpCall from '../utils/jsonpCall.js'

class Mail extends Api {
    constructor() {
        super()
        this.send = this.send.bind(this)
    }

    send(form) {
        jsonpCall('http://smart-ip.net/info-json', (ipInfo) => {
            form.ip = ipInfo.address
            form.country = ipInfo.countryName

            jsonpCall(
                `https://script.google.com/macros/s/${
                    conf.sendContactMessageUrlId
                }/exec?${Object.keys(form)
                    .map(
                        (property) =>
                            `${property}=${encodeURIComponent(form[property])}`
                    )
                    .join('&')}`,
                (response) => {
                    console.log(response)
                }
            )
        })
    }
}

export default new Mail()
