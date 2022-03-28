import {
    html,
    useEffect,
} from 'https://unpkg.com/htm@3.1.0/preact/standalone.module.js'
import { Page } from '../components/layout/page.js'
import { PostsAndCategories } from '../components/layout/postsAndCategories.js'
import { getActiveItemId } from '../utils/path.js'
import { Drive } from '../lib/drive.js'

export const Category = ({ state, dispatch }) => {
    const categories = state.categories
    const activeCategoryId = state?.activeItemId ?? getActiveItemId()
    const activeCategory = categories?.[activeCategoryId] ?? {}

    const isFetchingCategories = state?.isFetching?.categories
    useEffect(async () => {
        if (!isFetchingCategories && !Object.values(categories).length) {
            await Drive.fetchCategories(dispatch)
        }
    }, [categories, dispatch, isFetchingCategories])

    return html` <${Page}
        state=${state}
        dispatch=${dispatch}
        title=${activeCategory.title}
        sidebarImage=${activeCategory.image}
    >
        <${PostsAndCategories} state=${state} dispatch=${dispatch} />
    <//>`
}
