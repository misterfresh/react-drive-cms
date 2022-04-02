import { html } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import { PostsAndCategories } from '../components/layout/postsAndCategories.js'
import { getActiveItemId } from '../utils/path.js'
import { useCategoriesAndArticles } from '../hooks/useCategoriesAndArticles.js'

export const Category = ({ state, dispatch }) => {
    const { categories } = useCategoriesAndArticles()
    const activeCategoryId = state?.activeItemId ?? getActiveItemId()
    const activeCategory = categories?.[activeCategoryId] ?? {}

    return html` <${Page}
        title=${activeCategory.title}
        sidebarImage=${activeCategory.image}
    >
        <${PostsAndCategories} state=${state} dispatch=${dispatch} />
    <//>`
}
