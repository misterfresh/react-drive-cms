import { useState, useEffect } from '../lib/htm-preact.js'
import { Drive } from '../lib/drive.js'
const conf = window.appConf
const dashboardId = conf.dashboardId

// Many components need the post list; fetch the sheet once and share it.
let request = null
let cached = null
const loadCategoriesAndArticles = () => {
    if (!request) {
        request = Drive.fetchCategories(dashboardId).then(([error, response]) => {
            if (error) {
                request = null // allow a retry on the next mount
                throw new Error(error)
            }
            cached = response
            return response
        })
    }
    return request
}

export const useCategoriesAndArticles = () => {
    const [categoriesAndArticles, setCategoriesAndArticles] = useState(
        cached ?? { categories: {}, articles: {} }
    )

    useEffect(() => {
        if (cached) return
        let active = true
        loadCategoriesAndArticles().then((response) => {
            if (active) setCategoriesAndArticles(response)
        })
        return () => {
            active = false
        }
    }, [])

    return categoriesAndArticles
}
