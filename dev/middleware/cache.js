let cache = {
    cacheMap: {},
    hashMap: {},
    stale: {},
    links: {}
}

function set(store, key, value) {
    cache[store][key] = value
}

function remove(store, key) {
    delete cache[store][key]
}

function get(store, key) {
    if (typeof cache[store][key] === 'undefined') {
        return false
    }
    return cache[store][key]
}

function getAll(store) {
    return cache[store]
}

function dump() {
    console.log('hash map', JSON.stringify(cache.hashMap))
    console.log('cache map', JSON.stringify(Object.keys(cache.cacheMap)))
}

module.exports = {
    set,
    remove,
    get,
    getAll,
    dump
}
