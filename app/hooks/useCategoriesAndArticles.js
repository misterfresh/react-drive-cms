import { useState, useEffect } from '../lib/htm-preact.js'
import { Drive } from '../lib/drive.js'
const conf = window.appConf
const dashboardId = conf.dashboardId

export const useCategoriesAndArticles = () => {
    const [categoriesAndArticles, setCategoriesAndArticles] = useState({
        categories: {},
        articles: {},
    })

    useEffect(async () => {
        const [getCategoriesAndArticlesError, response] =
            await Drive.fetchCategories(dashboardId)
        if (getCategoriesAndArticlesError) {
            throw new Error(getCategoriesAndArticlesError)
        }
        const { categories, articles } = response
        setCategoriesAndArticles({ categories, articles })
    }, [])

    return categoriesAndArticles
}
