import { html, useEffect } from '../../deps/react.js'
import { Page } from '../components/layout/page.js'
import { PostsAndCategories } from '../components/layout/postsAndCategories.js'
import { getPathParts } from '../utils/path.js'
import { Drive } from '../lib/drive.js'

export const Category = ({ state, dispatch }) => {
    const categories = state.categories
    const activeCategoryId = state?.activeItemId ?? getPathParts()?.[2]
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
