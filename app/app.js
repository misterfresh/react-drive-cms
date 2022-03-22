import { html, render, useReducer, useMemo } from '../deps/react.js'
import { reducer, initialState } from './state.js'

import { Article } from './routes/article.js'
import { Category } from './routes/category.js'

import { About } from './routes/about.js'
import { Contact } from './routes/contact.js'
import { Home } from './routes/home.js'
import { getPathParts } from './utils/path.js'

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const pathParts = getPathParts()
    const CurrentPage = useMemo(() => {
        let Page = Home
        if (pathParts[0] === 'about') {
            Page = About
        } else if (pathParts[0] === 'contact') {
            Page = Contact
        } else if (pathParts[0] === 'categories') {
            Page = Category
        } else if (pathParts[0] === 'articles') {
            Page = Article
        }
        return Page
    }, [pathParts])

    return html`<${CurrentPage} state=${state} dispatch=${dispatch} />`
}

render(html`<${App} />`, document.getElementById('app-mount'))
