const conf = window.appConf

// Contact messages are delivered by Web3Forms (https://web3forms.com).
// The access key only allows sending to your inbox, so it's safe to be public.
const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

export const Mail = {
    async send(form) {
        if (!conf.web3formsAccessKey) {
            return ['The contact form is not set up yet.']
        }
        try {
            const response = await fetch(WEB3FORMS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    access_key: conf.web3formsAccessKey,
                    subject: `New message from ${form.name} via ${conf.author}`,
                    from_name: conf.author,
                    ...form,
                }),
            })
            const result = await response.json()
            if (!result.success) {
                return [result.message || 'Failed to send message']
            }
            return [null, result]
        } catch (error) {
            return ['Network error, please try again later']
        }
    },
}
