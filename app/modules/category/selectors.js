export const shouldFetchCategories = (state) =>
    !state.category.isFetching && !state.category.fetched
