import { html, render, useReducer, useMemo, useEffect } from '../deps/react.js'
import debounce from '../deps/debounce.js'
import { reducer, initialState } from './state.js'

import { Article } from './routes/article.js'
import { Category } from './routes/category.js'

import { About } from './routes/about.js'
//import { Contact } from './routes/contact.js'
import { Home } from './routes/home.js'
import { getPathParts } from './utils/path.js'

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const pageName = state?.pageName
    const CurrentPage = useMemo(() => {
        let Page = Home
        if (pageName === 'about') {
            Page = About
        } else if (pageName === 'contact') {
            Page = Contact
        } else if (pageName === 'categories') {
            Page = Category
        } else if (pageName === 'articles') {
            Page = Article
        }
        return Page
    }, [pageName])

    useEffect(() => {
        const showState = () => {
            debouncedConsole(state)
        }
        window.addEventListener('showState', showState)
        return function cleanup() {
            window.removeEventListener('showState', showState)
        }
    }, [state])

    useEffect(() => {
        const updatePath = () => {
            const parts = getPathParts()
            dispatch({
                type: 'URI_CHANGE',
                pageName: parts[1],
                activeItemId: parts[2],
            })
        }
        window.addEventListener('popstate', updatePath)
        return function cleanup() {
            window.removeEventListener('popstate', updatePath)
        }
    }, [dispatch])

    return html`<${CurrentPage} state=${state} dispatch=${dispatch} />`
}

render(html`<${App} />`, document.getElementById('app-mount'))

Object.defineProperty(window, 'state', {
    async get() {
        dispatchEvent(new CustomEvent('showState'))
    },
    configurable: true,
    enumerable: true,
})
const debouncedConsole = debounce(console.log, 1000)
