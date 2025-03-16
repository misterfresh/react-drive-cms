import {
    html,
    render,
    useReducer,
    useMemo,
    useEffect,
} from './lib/htm-preact.js'
import debounce from './utils/debounce.js'
import { reducer, initialState } from './state.js'

import { Article } from './routes/article.js'
import { Category } from './routes/category.js'

import { About } from './routes/about.js'
import { Contact } from './routes/contact.js'
import { Home } from './routes/home.js'
import { getActiveItemId, getPageName } from './utils/path.js'
import { Memoriam } from './routes/memoriam.js'
import { Music } from './routes/music.js'
import { Japanese } from './routes/japanese.js'
import { Chinese } from './routes/chinese.js'

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
        } else if (pageName === 'memoriam') {
            Page = Memoriam
        } else if (pageName === 'music'){
            Page = Music
        }else if(pageName === 'japanese'){
            Page = Japanese
        }else if(pageName === 'chinese'){
            Page = Chinese
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
            dispatch({
                type: 'URI_CHANGE',
                pageName: getPageName(),
                activeItemId: getActiveItemId(),
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
