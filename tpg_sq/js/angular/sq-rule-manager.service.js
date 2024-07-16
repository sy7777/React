angular.module('productApp')
    .service('sqRuleManager', function () {

        var defaultSqRule = ['whenFttbIsAvailable', 'whenNbnAndHwIsAvailable', 'when5gIsAvailable', 'whenHWIsAvailable', 'whenNbnIsAvailable', 'whenNbnIsNotServiceable', 'whenIncompleteInvalid'];
        var superFastSqRule = ['whenFttbIsAvailable', 'whenNoNbnButHW', 'whenIncompleteInvalid', 'whenHighSpeedIsAvailable', 'whenHighSpeedIsNotAvailable', 'whenNoNbnButAltTechsAvailable', 'whenNbnIsNotServiceable', 'whenIncompleteInvalid'];
        var nbnSqRule = ['whenNbnIsAvailableWithAltTechs', 'whenNbnIsAvailable', 'whenNoNbnButAltTechsAvailable', 'whenNbnIsNotServiceable', 'whenIncompleteInvalid','failedSq'];
        var fttbSqRule = ['whenFttbIsAvailableWithAltTechs', 'whenNoFttbButAltTechsAvailable', 'whenNbnIsNotServiceable', 'whenIncompleteInvalid'];
        var ftthSqRule = ['whenFtthIsAvailableWithAltTechs', 'whenNoFtthButAltTechsAvailable', 'whenNbnIsNotServiceable', 'whenIncompleteInvalid'];
        var homeSqRule = ['whenFttbIsAvailableWithAltTechs', 'whenListOfAltTechsAvailable', 'whenNbnIsNotServiceable', 'whenIncompleteInvalid','failedSq'];

        var currentPath = window.location.pathname;
        var matchingRule = [];
        var rules = [
            {
                'sqType': 'highSpeedNbn',
                'pageUrl': '/nbn/high-speed-nbn',
                'rule': superFastSqRule,
                'displayModal': true
            },
            {
                'sqType': 'default',
                'pageUrl': '/services/internet-plans',
                'rule': defaultSqRule,
                'displayModal': true
            },
            {
                'sqType': 'nbn',
                'pageUrl': '/nbn',
                'rule': nbnSqRule,
                'displayModal': false
            },
            {
                'sqType': 'home',
                'pageUrl': '/',
                'rule': homeSqRule,
                'displayModal': true
            },
            {
                'sqType': 'fttb',
                'pageUrl': '/fttb',
                'rule': fttbSqRule,
                'displayModal': false
            },
            {
              'sqType': 'fttb',
              'pageUrl': '/fttb_new',
              'rule': fttbSqRule,
              'displayModal': false
            },
            {
                'sqType': 'ftth',
                'pageUrl': '/ftth',
                'rule': ftthSqRule,
                'displayModal': false
            }
        ];


        function loadRules() {
            matchingRule = rules.filter(function (rule, offset) {
                if (currentPath === rule.pageUrl) {
                    return rule;
                }

                //return default value
                if ((rules.length - 1) === offset) {
                    return rule;
                }
            })[0];

            return matchingRule;
        }

        function debug() {
            console.groupCollapsed('sqRuleManager - rule group');
            console.log(matchingRule);
            console.groupEnd();
        }

        return {
            getRules: loadRules,
            debug: debug
        }

    });
