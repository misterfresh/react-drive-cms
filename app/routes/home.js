import { html } from '../lib/htm-preact.js'

import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { PostsAndCategories } from '../components/layout/postsAndCategories.js'

export const Home = ({ state, dispatch }) => html` <${Page}
    title="WELCOME! 歡迎! いらっしゃいませ!"
    subtitle=""
    description="This is a harpy eagle. Harpy eagles are originally from South America. Looking at their eyes, isn't this one a baddie?"
    sidebarImage=${prefixUriIfNeeded('/assets/harpy_eagle_1.jpg')}
    showLinks=${true}
>
    <${PostsAndCategories} state=${state} dispatch=${dispatch} />
<//>`
