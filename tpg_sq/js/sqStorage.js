//Storage mechanism for the OC
function sqStorage()
{
    var localStorageName = 'oneSQFullResult';

    function get() {
        return window.localStorage.getItem(localStorageName);
    }

    function set(oneSqResult) {
        window.localStorage.setItem(localStorageName, JSON.stringify(oneSqResult));
    }

    function remove() {
        return window.localStorage.removeItem(localStorageName);
    }

    return {
        get: get,
        set: set,
        remove: remove
    }
}
