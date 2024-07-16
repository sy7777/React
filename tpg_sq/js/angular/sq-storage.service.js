angular.module('productApp')
    .service('sqStorage', function ($window, sqResultService) {

        var storageName = 'adrdata';
        var OCStorageName = 'oneSQFullResult';

        function set() {
            $window.localStorage.setItem(storageName, JSON.stringify(sqResultService.get()));
            $window.sessionStorage.setItem(OCStorageName, JSON.stringify(sqResultService.get()));
        }

        function get() {
            if (window.sessionStorage.getItem(OCStorageName)) {
                return JSON.parse($window.sessionStorage.getItem(OCStorageName));
            } else {
                return JSON.parse($window.localStorage.getItem(storageName));
            }
        }

        function clear() {
            $window.sessionStorage.removeItem(OCStorageName);
            $window.localStorage.removeItem(storageName);
        }

        return {
            set: set,
            get: get,
            clear: clear
        };
    });
