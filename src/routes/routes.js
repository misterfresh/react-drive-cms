import React from 'react'

import Article from './article'
import Category from './category'

import About from './about'
import Contact from './contact'
import Home from './home'

import NoMatch from 'main/containers/noMatch'

export default [
    {
        path: '/',
        component: Home,
        exact: true
    },
    {
        path: '/articles/:articleId/:slug',
        component: Article
    },
    {
        path: '/categories/:categoryId',
        component: Category
    },
    {
        path: '/about',
        component: About,
        exact: true
    },
    {
        path: '/contact',
        component: Contact,
        exact: true
    },
    {
        path: '/*',
        component: NoMatch
    }
]
