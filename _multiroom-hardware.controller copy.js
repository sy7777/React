angular.module('signup')
    .controller("multiroomHardwareController", multiroomHardwareController)


function multiroomHardwareController($scope, $timeout, cartService, productService)
{
    var stbType = $scope.stbType;
    var numTerminals = 0;

    // GET MINI STB INFO
    productService.getById(stbType.mighty)
        .then(function(data) {
            console.log("mighty coming in data");
            $scope.mightyInfo = data;
        });

    // UPDATE NUM TERMINALS SHOWN
    $scope.updateMultirooms = function() {

        $scope.resetMultirooms();

        var numTerminals = $scope.numTerminals;
        if (numTerminals > 0) {
            for (var i = 1; i <= numTerminals; i++) {
                $scope.addMultirooms(i);
            }

            $scope.show(1);
            $scope.enable(1);
        }
    }

    // UPDATE CARTSERVICE OVERRIDE FOR HARDWARE PAGE
    $scope.updateCartService = function()
    {
        var miniStbSelected = $scope.multiroomsSelect(stbType.mini);
        var qtyMiniStb = miniStbSelected.length;
        var qtyMultiroom = miniStbSelected.length;

        //RESET MULTIROOMS IN CART
        $scope.resetCart();

        //ADD MIGHTY
        if ($scope.isMightySelected) {
            console.log("111");
            cartService.selectProduct(stbType.mighty, 1);
            qtyMultiroom += 1;
        }       
        //ADD FETCH MINI
        if ($scope.isFetchMiniSelected) {
            console.log("111ffff");
            cartService.selectProduct($scope.fetchMini, 1);
            qtyMultiroom += 1;
        }

        //ADD MULTIROOM PRODUCTS
        cartService.selectProduct(stbType.mini, qtyMiniStb);
        cartService.selectProduct($scope.multiroom, qtyMultiroom);

    }


    $scope.showMighty = function() {
        var numberOfMultiroomsSelected = $scope.multiroomsSelect(stbType.mini).length;
        var numberOfMightySelected     = $scope.isMightySelected ? 1 : 0;
        var numberOfFetchMiniSelected  = $scope.isFetchMiniSelected ? 1 : 0;
        var totalSelected = numberOfMultiroomsSelected + numberOfMightySelected + numberOfFetchMiniSelected;
        return ((totalSelected == numTerminals) && (!$scope.isMightySelected) && (!$scope.isFetchMiniSelected)) ? false : true;
    }


    // Toggle SetTopBox Override for hardware page
    $scope.toggleMultiRoom = function(id) {
        var matchIndex = $scope.getIndex(id);
        var nextIndex = matchIndex + 1;

        if ($scope.multirooms[matchIndex]["selected"] == false) {
            $scope.multirooms[matchIndex]["selected"] = true;

            //check index boundary and enabled next index
            if ($scope.multirooms[nextIndex] != undefined) {
                $scope.multirooms[nextIndex]["show"] = true;
                $scope.multirooms[nextIndex]["disabled"] = false;
            }

        }
        else if ($scope.multirooms[matchIndex]["selected"] == true) {
            $scope.multirooms[matchIndex]["selected"] = false;

            if ($scope.multirooms[nextIndex] != undefined) {
                for (var i = nextIndex; i < $scope.multirooms.length; i++) {
                    $scope.multirooms[i]["show"] = false;
                    $scope.multirooms[i]["selected"] = false;
                    $scope.multirooms[i]["disabled"] = true;
                }
            }
        }

        $scope.updateCartService();
    }

    // INITIALIZE FOR HARDWARE PAGES
    $scope.hardwareInit = function() {
        $scope.resetCart();
        $scope.updateCartService();
    }

    $scope.hardwareInit();

    $scope.reselectMultirooms = function (numSelected) {
        var i = 1;
        while (i <= numSelected) {
            $scope.toggleMultiRoom(i);
            i++;
        }
    }

    $scope.toggleMighty = function($evt) {
         var numMultiroomSelected = $scope.multiroomsSelect(stbType.mini).length;
          if ($scope.isMightySelected) {
            console.log("33333");
              $scope.numTerminals = numTerminals - 1;
          }
          else {
              $scope.numTerminals = numTerminals;
          }

          $scope.updateMultirooms();
          $scope.reselectMultirooms(numMultiroomSelected);
          $timeout(function () {
            $scope.updateCartService();
          })
    }    
    
    $scope.toggleFetchMini = function($evt) {
         var numFetchMiniSelected = $scope.multiroomsSelect(stbType.mini).length;
          if ($scope.isFetchMiniSelected) {
            console.log("33333");
              $scope.numTerminals = numTerminals - 1;
          }
          else {
              $scope.numTerminals = numTerminals;
          }

          $scope.updateMultirooms();
          $scope.reselectMultirooms(numFetchMiniSelected );
          $timeout(function () {
            $scope.updateCartService();
          })
    }

    $scope.$on("ipeservices.existingCustomerService.authentication.changed", function(e, authed){
        $scope.canOrderHardware = (authed) ? true : false;
    });

    $scope.$on("ipeservices.iiExistingServices.serviceSelected", function(evt, selectedService) {

            //INITIALIZATIONS
            $scope.numTerminals = 0;
            $scope.isEligible = false;

            if (selectedService.fetchHousehold != null) {
                // GET NUM TERMINALS AVAILABLE FOR THIS CUSTOMER
                numTerminals        = selectedService.fetchHousehold.numTerminals || 0
                $scope.numTerminals = numTerminals;
                $scope.isEligible   = selectedService.fetchHousehold.isEligible || false;
                $scope.updateMultirooms();
            }

    });
};