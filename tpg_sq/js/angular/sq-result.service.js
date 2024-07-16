angular.module('productApp')
    .service('sqResultService', function() {
        var sqResult = {};

        function set(result) {
            sqResult = JSON.parse(JSON.stringify(result));
        }

        function get() {
            return sqResult;
        }

        function reset() {
            sqResult = {};
        }

        return {
            set: set,
            get: get,
            reset: reset
        }
    });