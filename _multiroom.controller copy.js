angular.module('signup')
    .controller("multiroomController", multiroomController)

function multiroomController($scope, productService, cartService) {

    var stbType   = { mini: "202302 Fetch 4k Mini STB", mighty: "201810 Fetch Gen 3 Mighty STB"};
    var multiroom = "FetchTV Multiroom";
    var fetchMini = "Fetch Mini";

    $scope.debug = false;
    $scope.stbInfo = {}
    $scope.multirooms = [];
    $scope.isMighty = false;
    $scope.showMultiroomSection = true;

    $scope.stbType = stbType;
    $scope.multiroom = multiroom;
    $scope.multiroom = fetchMini;

    // GET MULTIROOM INFO
    productService.getById(multiroom)
        .then(function(data) {
            $scope.productInfo = data;
            console.log("look at me1111",data);
         });   
    
    // GET MULTIROOM INFO
    productService.getById(fetchMini)
        .then(function(data) {
            $scope.productInfo = data;
            console.log("look at me",data);
         });

    // GET MINI STB INFO
    productService.getById(stbType.mini)
        .then(function(data) {
            $scope.stbInfo = data;
        }) ;

    $scope.resetCart = function() {
        cartService.removeProduct(multiroom, true);
        cartService.removeProduct(stbType.mini, true);
        cartService.removeProduct(stbType.mighty, true);
    }

    // INITIALIZE MULTIROOM OBJECT AND PUSH INTO ARRAY
    $scope.addMultirooms = function(id) {
        var multiroom = {
            id: id,
            product: stbType.mini,
            show: false,
            selected: false,
            disabled: true
        }
        $scope.multirooms.push(multiroom);
    }

    $scope.resetMultirooms = function() {
        $scope.multirooms = [];
    }

    // RETURN INDEX FOR MULTIROOM RECORD
    $scope.getIndex = function(id) {
        var index = -1;
        $scope.multirooms.some(function(item, i) {
            if (item.id == id) {
                index = i;
            }
        })
        return index;
    }

    //RETURN NUMBER OF MULTIROOMS SELECTED
   $scope.multiroomsSelect = function(productTarget)
    {
        var product = productTarget || false;

        return $scope.multirooms.filter(function(multiroom) {
            if (product)
                return ((multiroom.selected) && (product == multiroom.product));
            else
                return multiroom.selected;

        })
    }

    // UPDATE CARTSERVICE
    $scope.updateCartService = function()
    {
        var multiroomsSelected = $scope.multiroomsSelect();
        var qtySelected = multiroomsSelected.length;
        var qtyStb = $scope.isMighty ? qtySelected : qtySelected + 1;

        //RESET MULTIROOMS IN CART
        cartService.removeProduct(multiroom);
        cartService.removeProduct(stbType.mini);

        //ADD PRODUCTS
        if (qtySelected > 0) {
            cartService.selectProduct(stbType.mini, qtyStb);
            cartService.selectProduct(multiroom, qtySelected);
        }
    }

    $scope.debugAddedProducts = function (){
        var products = cartService.getSelectedProducts('IPTVHardware');
        return products;
    }

    //INIT MULTIROOM ROWS WHEN TEMPLATE LOADS
    $scope.init = function () {
        var numTerminals = $scope.numTerminals;
        for (var i = 1; i <= numTerminals; i++) {
            $scope.addMultirooms(i);
        }

        $scope.show(1);
        $scope.enable(1);

        $scope.updateCartService();
    }

    // SWITCH TEMPLATE
    $scope.getTemplateUrl = function() {
        var page = $scope.multiroomPage || !!0;

        switch (page) {
            case "Fetch":
                return "/_shared/signup-angular/_tmpl/multiroom-fetchpage.tmpl";
                break;
            case "IPTVhardware":
                return "/_shared/signup-angular/_tmpl/multiroom-hardware.tmpl";
                break;
            default:
                return "/_shared/signup-angular/_tmpl/multiroom.tmpl"
        }
    }

    // SHOW MULTIROOM ROW
    $scope.show = function(id) {
        var matchIndex = $scope.getIndex(id);
        $scope.multirooms[matchIndex]["show"] = true;
    }

    // ENABLE MULTIROOM
    $scope.enable = function(id) {
        var matchIndex = $scope.getIndex(id);
        $scope.multirooms[matchIndex]["disabled"] = false;
    }

    // Toggle Multiroom selections
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

    // RETURN NUMBER MULTIROOMS ALLOWED
    $scope.getMultiroomsAvailable = function () {
        return $scope.multirooms;
    }

    // CHECK IF BUTTON IS DISABLED
    $scope.isDisabled = function(id){
        var matchIndex = $scope.getIndex(id);
        return $scope.multirooms[matchIndex]["disabled"];
    }

    $scope.syncButtonsWithCart = function() {

        // reset multirooms
        for (var i=0; i<$scope.multirooms.length;i++) {
            $scope.multirooms[i]["show"]       = false;
            $scope.multirooms[i]["selected"]   = false;
            $scope.multirooms[i]["disabled"]   = true;
        }

        $scope.show(1);
        $scope.enable(1);

        $scope.resetCart();
    }

    $scope.$on("ipeservices.cart.orderchanged", function(evt, cart) {
       var iptvSelectedForPlan = cartService.getSelectedProducts(['IPTV', 'IPTVHardware'])[0] || false;
       if (iptvSelectedForPlan == false) {
            $scope.syncButtonsWithCart();
       }
    });


    // LISTEN FOR BROADCAST EVENT FROM STBMIGHTY
    $scope.$on('fetch.mightyStbSelected', function (evt, val) {

        var isMightySelected = val;
        var stbSelectedCount =  $scope.multiroomsSelect().length;

        cartService.removeProduct(stbType.mini);
        cartService.removeProduct(stbType.mighty);

        if(isMightySelected) {
            console.log("4444");
            $scope.isMighty = true;
            cartService.selectProduct(stbType.mighty, 1);

            // re-add additional STB
            if (stbSelectedCount > 0) {
                cartService.selectProduct(stbType.mini, stbSelectedCount);
            }
        }
        else
        {
            $scope.isMighty = false;
            // re add using normal workflow
            $scope.updateCartService();
        }

    })

    $scope.$on("ipeservices.iiExistingServices.serviceSelected", function(evt, selectedService) {

        //INITIALIZATIONS
        $scope.numTerminals = 0;
        $scope.isEligible = false;

        $scope.showMultiroomSection = ((selectedService.fetchHousehold == null) && selectedService.category.indexOf('OffNetADSL') !== -1) ? false : true;

        if (selectedService.fetchHousehold != null) {
            // GET NUM TERMINALS AVAILABLE FOR THIS CUSTOMER
            $scope.numTerminals = selectedService.fetchHousehold.numTerminals || 0;
            $scope.isEligible   = selectedService.fetchHousehold.isEligible || false;
            //$scope.numTerminals = 0;
            $scope.syncButtonsWithCart();
        }

    });

}