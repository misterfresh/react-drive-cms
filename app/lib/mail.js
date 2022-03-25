import { Api } from './api.js'
const conf = window.appConf
import jsonpCall from '../utils/jsonpCall.js'
import {to} from "../utils/to.js";

const IP_INFO_URL = `http://ip-api.com/json`
const APPS_SCRIPT_BASE_URL = `https://script.google.com/macros/s/${
    conf.sendContactMessageUrlId
}/exec?`

export const Mail = {
    ...Api,
    async getIpInfo() {
        return await to(new Promise((resolve, reject) => {
            try {
                jsonpCall(IP_INFO_URL, ipInfo => resolve(ipInfo))
            } catch (error) {
                reject(error)
            }
        }))
    },
    async send(form) {
        const [ipError, ipInfo] = await this.getIpInfo()
        if(ipError) {
            return [ipError]
        }
        const message = {
            ...form,
            ip: ipInfo?.query,
            country: ipInfo?.country
        }
        const queryParams = Object.keys(message)
            .map(
                (property) =>
                    `${property}=${encodeURIComponent(message[property])}`
            )
            .join('&')

        return await to(new Promise((resolve, reject) => {
            try {
                jsonpCall( APPS_SCRIPT_BASE_URL + queryParams, response => resolve(response))
            } catch (error) {
                reject(error)
            }
        }))
    },
}
