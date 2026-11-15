// Privacy-friendly visitor stats with Cloudflare Web Analytics (no cookies).
// Turned on by setting cloudflareAnalyticsToken in conf.js.
// With "spa": true the beacon also counts pages opened without a reload.
const conf = window.appConf

export const loadAnalytics = () => {
    const token = conf.cloudflareAnalyticsToken
    if (!token || document.querySelector('script[data-cf-beacon]')) return
    const script = document.createElement('script')
    script.defer = true
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
    script.dataset.cfBeacon = JSON.stringify({ token, spa: true })
    document.head.appendChild(script)
}
