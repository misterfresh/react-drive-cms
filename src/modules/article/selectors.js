export const shouldFetchArticle = (state, articleId) => {
    if (!articleId) {
        return false
    }
    return (
        !articleIsLoading(state, articleId) &&
        typeof state.article.texts[articleId] === 'undefined'
    )
}

export const articleIsLoading = (state, articleId) => {
    if (!articleId) {
        return false
    }
    return state.article.isFetching[articleId]
}

export const articleIsFetched = (state, articleId) => {
    if (!articleId) {
        return false
    }
    return state.article.fetched[articleId]
}
