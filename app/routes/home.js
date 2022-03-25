import { html } from '../../deps/react.js'

import { Page } from '../components/layout/page.js'
import resolveAsset from '../utils/resolveAsset.js'
import { PostsAndCategories } from '../components/layout/postsAndCategories.js'

export const Home = ({ state, dispatch }) => html` <${Page}
    title="Cats"
    subtitle="React Drive CMS Demo"
    description="Publish articles directly from Google Drive to your website."
    sidebarImage=${resolveAsset('/assets/default-sidebar.jpg')}
    showLinks=${true}
    state=${state}
    dispatch=${dispatch}
>
    <${PostsAndCategories} state=${state} dispatch=${dispatch} />
<//>`
