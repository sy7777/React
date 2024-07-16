angular.module('productApp')
    .service('sqDebugService', function(sqRuleManager, sqRuleService) {
        var debug = false;

        function enableSqDebug() {
            debug = true;
        }

        function isDebug() {
            return debug;
        }

        function showDebugInfo() {
            sqRuleManager.debug();
            sqRuleService.debug();
        }

        return {
            enableDebug: enableSqDebug,
            isDebug: isDebug,
            showDebugInfo: showDebugInfo

        }
    });