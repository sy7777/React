angular.module('productApp')
    .service('sqRuleService', function($window, sqRuleManager, sqResultService) {
        var rules = {};
        var matchedRule = {
            rule: null,
            view: null,
            modalView: null,
            redirectURL: false,
        };

        function execute() {
            var sqData = sqResultService.get();
            var alreadyMatched = false;
            rules = sqRuleManager.getRules();

            rules.rule.forEach(function(rule) {
                var ruleFn = $window[rule];
                if (typeof ruleFn === "object") {
                    if (ruleFn.isMatched(sqData) && !alreadyMatched) {
                        matchedRule.rule = rule;
                        if (ruleFn.redirectURL() !== false) {
                            matchedRule.redirectURL = ruleFn.redirectURL();
                            matchedRule.modalView = rules.displayModal === true ? ruleFn.modalView() : true;
                        } else {
                            matchedRule.view = ruleFn.view();
                            matchedRule.modalView = rules.displayModal === true ? ruleFn.modalView() : false;
                        }
                        alreadyMatched = true;
                    }
                }
                else {
                    console.error(rule + ' rule not found');
                }
            });
        }

        function getView() {
            return matchedRule.view;
        }

        function getModalView() {
            return matchedRule.modalView;
        }

        function getRedirectURL() {
            return matchedRule.redirectURL;
        }

        function getIsShowModal() {
            return rules.displayModal;
        }

        function reset() {
            matchedRule = {
                rule: null,
                view: null,
                modalView: null,
                redirectURL: false
            };
        }

        function debug() {
            console.groupCollapsed('SqRuleService - matched rule');
            console.log(rules);
            console.log(matchedRule);
            console.groupEnd();
        }

        return {
            run: execute,
            view: getView,
            modalView: getModalView,
            reset: reset,
            debug: debug,
            redirectURL: getRedirectURL,
            isShowModal: getIsShowModal
        };
    });
