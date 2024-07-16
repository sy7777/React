angular.module('productApp')
    .controller('SqController', ['$scope', 'sqResultService', 'sqUIService', 'sqRuleService', 'sqStorage', 'sqDebugService', '$rootScope', 'sqAltTech', '$http',
        function ($scope, sqResult, sqUI, sqRuleService, sqStorage, sqDebugService, $rootScope, sqAltTech, $http) {
            var showModal = false;
            var isPersistentSQ = false;
            var filterAltTech = null;

            $scope.sq = sqResult.get();
            sqDebugService.enableDebug();
            $scope.productInfo = productInfo;

            $scope.isHomePage = function () {
                return window.location.pathname === "/";
            };

            $scope.isNbnPage = function () {
                return window.location.pathname === "/nbn";
            }

            $scope.$watch('sq', function (newVal, oldVal) {
                if (newVal !== undefined && Object.keys(newVal).length > 0) {
                    if (showModal) {
                        sqUI.showSqModal();
                    }
                    sqUI.showSqResult();

                    if (filterAltTech !== null) {
                        $scope.altTechs = sqAltTech.compileAltTechs($scope.sq, filterAltTech);
                    }
                }
            });

            $scope.bindAddressRefinementForm = function () {
                sqUI.bindAddressRefinementEvents();
            };

            $scope.populateAddressForm = function (address) {
                if ($scope.hasSqResult()) {
                    sqUI.populateAddress(address);
                }
            };

            function update() {
                $scope.sq = sqResult.get();
                $rootScope.sqResult = $scope.sq;

                if ($scope.hasSqResult()) {
                    sqRuleService.run();
                    sqStorage.set();
                }

                if (sqRuleService.isShowModal() && isPersistentSQ !== true) {
                    showModal = true;
                }

                $scope.view = sqRuleService.view();
                $scope.modalView = sqRuleService.modalView();

                if (sqDebugService.isDebug()) {
                    sqDebugService.showDebugInfo();
                }

                if (sqRuleService.redirectURL() !== false) {
                    window.location.href = sqRuleService.redirectURL();
                }

                isPersistentSQ = false;
            }

            $scope.setSqResult = function (sq) {
                sqResult.set(sq);
                update();
                $scope.$apply();
            };

            $scope.resetSq = function () {
                sqResult.reset();
                sqRuleService.reset();
                sqStorage.clear();
                sqUI.hideSqModal();

                sqUI.emptySqInput();

                update();
            };

            $scope.hasSqResult = function () {
                return JSON.stringify($scope.sq) !== "{}";
            };

            // Persistent SQ - Also disables modal from showing again due to persistent SQ
            if (sqStorage.get() !== null && !$scope.isHomePage()) {
                isPersistentSQ = true;
                sqResult.set(sqStorage.get());
                update();
            }

            $scope.showCommonsRegisterYourInterest = function (modal, updateOnly) {
                updateOnly = updateOnly || false;
                sqUI.hideSqModal();
                sqUI.showRegisterYourInterestModal(modal, updateOnly);
            };

            $scope.dateFn = {
                formatDate: function (dateString) {
                    var date = new Date(dateString);
                    var dateParts = date.toDateString().substr(4).split(' ');
                    var dateGlue = [dateParts[1], dateParts[0], dateParts[2]];

                    return dateGlue.join('-');
                },
                isOverdue: function (dateString) {
                    return new Date(dateString).getTime() < new Date().getTime();
                }
            };

            $scope.getTechnologyName = function (technology) {
                var technologyName = {
                    FTTC: "Fibre to the Curb",
                    Fibre: "Fibre to the Premises",
                    FTTN: "Fibre to the Node",
                    FTTB: "Fibre to the Building",
                    HFC: "Hybrid Fibre Coaxial"
                };
                var fullTechnologyName = technologyName[technology];
                return fullTechnologyName !== undefined ? "(" + fullTechnologyName + ")" : "";
            };

            $scope.getAltTechs = function (productToFilter) {
                filterAltTech = productToFilter;
                $scope.altTechs = sqAltTech.compileAltTechs($scope.sq, filterAltTech);
            };

            $scope.is5GPreorder = function () {
                return $scope.sq.WIRELESS5G.hasOwnProperty("readyForService");
            };

            $scope.isFibreConnectAvailable = function () {
                return $scope.sq.NBN.hasOwnProperty('nbnAlternativeAccessTechnology') && $scope.sq.NBN.nbnAlternativeAccessTechnology.type === 'Fibre';
            }
        }]);
