import { html, render, useReducer, useMemo, useEffect } from '../deps/react.js'
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
