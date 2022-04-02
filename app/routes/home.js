import { html } from '../lib/htm-preact.js'

import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { PostsAndCategories } from '../components/layout/postsAndCategories.js'

export const Home = ({ state, dispatch }) => html` <${Page}
    title="Cats"
    subtitle="React Drive CMS Demo"
    description="Publish articles directly from Google Drive to your website."
    sidebarImage=${prefixUriIfNeeded('/assets/default-sidebar.jpg')}
    showLinks=${true}
>
    <${PostsAndCategories} state=${state} dispatch=${dispatch} />
<//>`
