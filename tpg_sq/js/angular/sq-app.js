'use strict';

if (productApp === undefined) {

    var productApp = angular.module('productApp', ['ngSanitize']);

    angular.module('productApp')
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('{*').endSymbol('*}');
        })
        .filter("trust", ['$sce', function($sce) {
            return function(htmlCode) {
                return $sce.trustAsHtml(htmlCode);
            };
        }]);
}
