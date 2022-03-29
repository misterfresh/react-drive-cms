import { html } from 'https://unpkg.com/htm@3.1.0/preact/standalone.module.js'

import { Page } from '../components/layout/page.js'
import prefixUriWhenNeeded from '../utils/prefixUriIfNeeded.js'
import { PostsAndCategories } from '../components/layout/postsAndCategories.js'

export const Home = ({ state, dispatch }) => html` <${Page}
    title="Cats"
    subtitle="React Drive CMS Demo"
    description="Publish articles directly from Google Drive to your website."
    sidebarImage=${prefixUriWhenNeeded('/assets/default-sidebar.jpg')}
    showLinks=${true}
    state=${state}
    dispatch=${dispatch}
>
    <${PostsAndCategories} state=${state} dispatch=${dispatch} />
<//>`
