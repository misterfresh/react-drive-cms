export default class Api {
    constructor() {
        this.call = this.call.bind(this)
        this.get = this.get.bind(this)
        this.post = this.post.bind(this)
    }

    call(
        url,
        options = {
            method: 'GET',
            credentials: 'include',
            headers: {},
        }
    ) {
        let { method, credentials, headers } = options

        if (!credentials) {
            options = { ...options, credentials: 'include' }
        }

        options = Object.assign({}, options, {
            headers,
        })

        return fetch(url, options)
    }

    get(
        url,
        options = {
            method: 'GET',
            credentials: 'include',
        }
    ) {
        return this.call(url, { ...options, method: 'GET' })
    }

    post(
        url,
        options = {
            method: 'POST',
            credentials: 'include',
        }
    ) {
        return this.call(url, { ...options, method: 'POST' })
    }
}
