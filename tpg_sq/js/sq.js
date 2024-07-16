var savedSQRes = {}, previousRes = false;
var res1Counter = 0, res2Counter = 0;
var showSQLoading;

(function($, sqStorage, sqToggle) {

    var storage = new sqStorage();
    var webformSQ = false;
    //integrate SQ with webform
    if(typeof webformSQGlobal !== 'undefined'){
        webformSQ = webformSQGlobal;
        // console.log(webformSQ);
    }

    document.tpgSqPlugin = this;
    var confirmAddr = [];
    var address_not_found = {label: "Can't find your address2? <br class='visible-xs' /><a href='#'>Enter your address manually</a>", value: $('.sq-address-input').val() };
    var addressFields = $("#address, #addressRegInt");
    var sqSection = '#section2';
    var sqResultTempaltes = '#sqResultTempaltes';

    if(webformSQ){
        addressFields = $(".webform-submission-form input[name=address]");
        addressFields.on('blur', function() {
            if($(this).val() != $('input[name=webform-address]').val()){
                confirmAddr = [];
                $(this).val('');
                $('input[name=tech]').val('').removeClass('ui-autocomplete-loading');
            }
        });
    }

    $('#address').on('blur', function() {
        confirmAddr = [];
        $(this).autocomplete("option", "minLength", 1);
        $(this).autocomplete("search", "");
    });

    this.invalidAddressForm = function(data) {
        showAddressForm(function(){ populateAddressForm(data.Address); });
        showSQLoading(true);
        displaySQModal(false);
    };

    function initNbnMessages() {
        // adding element to DOM and attaching event handler
        if ($(sqSection + ' ' + sqResultTempaltes).length < 1) {
            $(sqResultTempaltes).detach().prependTo(sqSection);
            $(sqResultTempaltes).on("click", "a.change-address", function(e) {
                storage.remove();
                e.preventDefault();
                $('#address').val('');
                $(sqSection + ' > .inside_container').show();
                $(sqResultTempaltes).hide();
            });
        }
    };

    this.showNbnSuccess = function(action) {
        if (!action) {
            action = 'Success';
        }
        initNbnMessages();
        if( $(sqResultTempaltes).is(':hidden') ) {
            $(sqSection + ' > .inside_container').hide();
            var address = $('#address').val();
            var el = $(sqResultTempaltes + ' .sqNbn' + action);
            el.find('span.sqAddress').text(address);
            el.siblings().hide();
            el.show();
            el.parent().show();
        }
    };

    this.showNbnPreorder = function() {
        this.showNbnSuccess('Preorder');
    };

    this.isNbn = function(data) {
        return data.Services && data.Services.nbn && data.Services.nbn > 0;
    };

    this.isNbnPreorder = function(data) {
        return this.isNbn(data) && data.NBN.res === 12;
    };

    this.isFttb = function(data) {
        return data.Services && data.Services.fttb && data.Services.fttb > 0;
    };

    addressFields.autocomplete({
        appendTo: "#sq-wrapper",
        html: true,
        position: { my : "left top", at: "left bottom", of: "#sq-wrapper" },
        source: function(request, response) {
            var addressField = $(this.element);
            addressField.addClass('ui-autocomplete-loading');

            if (confirmAddr.length !== 0) {
                response($.ui.autocomplete.filter(confirmAddr, request.term));
                addressField.removeClass('ui-autocomplete-loading');
            }
            else {
                var addressObj = [];
                $.ajax({
                    url: '/api/sq',
                    data: request,
                    dataType: "json",
                    success: function(data) {
                        if (data.length > 0) {
                            data.forEach(function(v, i) {
                                addressObj.push({'label': v, 'value': v});
                            })
                        }
                        if (addressField.data('nomatch') == 'dialog') {
                            addressObj.push(address_not_found);
                        }
                        response(addressObj);
                    },
                    error: function() {
                        if (addressField.data('nomatch') == 'dialog') {
                            addressObj.push(address_not_found);
                        }
                        response(addressObj);
                    },
                    complete: function() {
                        addressField.removeClass('ui-autocomplete-loading');
                    }
                });
            }
        },
        select: function(event, ui) {
            if (ui.item.label === address_not_found.label) {
                $(addressFields).val();
                clearAndDisable('all');
                showAddressForm();
                return false;
            }

            if(webformSQ){
                $('input[name=webform-address]').val(ui.item.value);
                $('input[name=webform-tech]').val('');
                $('input[name=tech]').val('').addClass('ui-autocomplete-loading');
            }

            $(this).data('fullAddrSelected', true);
            if ($(this).data('lock-address') == "yes") {
                qasSelected(this, ui.item.value);
            }
            showSQLoading(true);
            if (confirmAddr.length) {
                displaySQModal(true); // blur will set confirmAddr = []
                $(this).autocomplete("option", "minLength", 1);

                $.ajax({
                    url: '/api/address_checker',
                    type: 'POST',
                    dataType: "json",
                    timeout: "200000",
                    data: 'locid=' + ui.item.locid + '&fullAddress=' + ui.item.value + '&searchtype=sq&onesq=1',
                    success: function(data) {
                        postProcessSQResult('success', data);
                    },
                    error: function() {
                        postProcessSQResult("error", []);
                    }
                });
            }
            else {
                displaySQModal(true);

                $.ajax({
                    url: '/api/sq',
                    type: 'GET',
                    dataType: "json",
                    timeout: "200000",
                    data: 'addr=' + ui.item.value + '&onesq=1&searchtype=sq',
                    success: function(data) {
                        postProcessSQResult('success', data);
                    },
                    error: function() {
                        postProcessSQResult("error", []);
                    }
                });
            }
        },
        open: function() {
            $(this).data('fullAddrSelected', false);
            $('.ui-autocomplete').css('width', $(this).css('width'));
        },
    });
    // fix for iOS >= 8.1
    addressFields.autocomplete('widget').off('menufocus hover mouseover mouseenter');

    this.pushGADatalayer = function (data) {
        if (typeof dataLayer !== undefined && data.NBN !== undefined) {
            // process service list
            var serviceList = [];
            if (data.Services !== undefined) {
                for (var serv in data.Services) {
                    if (data.Services[serv] > 0) {
                        serviceList.push(serv);
                    }
                }
            }
            services = serviceList.join(',') || 'none';

            dataLayer.push({'event': 'sqFire', 'resStatus': data.NBN.res, 'resServices': services });
        }
    }

    function postProcessSQResult(status, data) {

        var sqVersion = new sqToggle();

        if (sqVersion.isNewVersion()) {
            this.pushGADatalayer(data);

            if (data.NBN === undefined || data.NBN.hasOwnProperty('addr_list')) {
                confirmIncompleteAddr(data.NBN.addr_list);
            } else {
                displaySQModal(false);
                var ngSq = angular.element('#ng-sqresult').scope();
                ngSq.setSqResult(data);
            }
            return false;
        }

        /*
        0	NBN Pre-order (expired)		UNIT 4, 37 EDNA ST, LILYFIELD NSW 2040
        1	DSL Onnet					7 Watarrka avenue, Fitzgibbon  QLD  4018
        2	DSL Offnet					6 Selwyn Circuit, TRINITY PARK  QLD  4879
        3	Invalid						Unit 3 36 THREADFIN LOOP SOUTH HEDLAND 6722 WA
        4	Incomplete					U5 33 ULTIMO RD, HAYMARKET NSW 2000
        5	NBN Pre-order (FTTP)		1 McLellan Court, WYE RIVER VIC 3234
        6 	NBN Pre-order (FTTN)		House 1 4 Greyjack Court, WORONGARY QLD 4213
        */
        //data = results[0];

        var hw = new homeWireless(data);

        savedSQRes = data; // copy to global

        if (status == 'error') {
            data = {"Address":{},"Services":{"nbn":-1,"fttb":-1,"adsl":-1, "fwa_4g":-1, "fwa_5g":-1},"NBN":{"res":7},"FTTB":{},"ADSL":{}};
        }

        storage.set(data);

        if (data.NBN === undefined) {
            data.NBN = { res: 7 };
        }

        // GA tracking
        this.pushGADatalayer(data);

        var msg ='<h4>Unfortunately an error has occurred when processing your request.</h4>';
        var page = '', action = 'noRedirect';

        /*
            Codes below relate to the following explanations:

            From NBN Co:
            'res'=>0, 'data'=>'serviceable'
            'res'=>1, 'data'=>'Invalid address' / API error or timeout
            'res'=>2, 'data'=>'POI cannot be found' / No CVC data returned
            'res'=>3, 'data'=>'POI not active' / POI not found
            'res'=>4, 'data'=>'NBN not ready'
            'res'=>7, 'data'=>'B2B Exception'
            'res'=>8, 'data'=>'Timeout Error'
            'res'=>9, 'data'=>'Incorrect input

            From TPG offline SQ data:
            'res'=>10 OSQ_SERVICEABLE
            'res'=>11 OSQ_SERVICEABILITY_UNKNOWN
            'res'=>12 OSQ_SERVICEABLE_SOON
            'res'=>13 OSQ_INCOMPLETE_ADDRESS
            'res'=>14 OSQ_NOT_SERVICEABLE
        */

        if (status == 'success') {
            if (data.Services && data.Services.fttb > 0) {
                action = 'reseller';
                if (data.FTTB.technology == 'FTTH') {
                    msg = "<h4>CONGRATULATIONS!</h4>You can get TPG High Speed Broadband with Fibre To The Home Technology.";
                    page = '/ftth';
                }
                else {
                    msg = "<h4>CONGRATULATIONS!</h4>You can get TPG High Speed Broadband with Fibre To The Building Technology.";
                    page = '/fttb';
                }
                // showSQLoading(false);
                showSQResult(status, msg, action, page, data);
            } else {
                switch (data.NBN.res) {
                    case 0:
                    case 10:
                        msg = "<h4>CONGRATULATIONS!</h4>We can provide you with a NBN Bundle.";
                        action = 'nbnpass';
                        if (data.NBN.technology !== 'Wireless') {
                            page = hw.getUrl();
                        }
                        else {
                            page = '/nbn#fixed-wireless';
                        }
                        break;
                    case 12:
                        var nbnEtaOverdue = new Date(data.NBN.readyForService).getTime() < new Date().getTime();
                        if (nbnEtaOverdue) {
                            msg = '<h4>NBN ROLLOUT TO YOUR ADDRESS HAS BEEN DELAYED</h4><p>NBN is expected to be serviceable in your area but your home is not ready yet. Pre-order now and we will connect your home when NBN arrives.</p>';
                        }
                        else {
                            msg = "<h4>CONGRATULATIONS!</h4> NBN is coming soon to your area</b> <br/> Pre-order now and we will connect your home when NBN arrives. Your <br/> address is expected to be NBN ready on ";
                            var d = new Date(data.NBN.readyForService);
                            var a = d.toDateString().substr(4).split(' ');
                            var b = [a[1],a[0],a[2]];
                            msg += b.join('-')+ "<br/>";
                        }
                        action = 'nbnofflpass';
                        page = '/nbn#preorder';
                        break;
                    case 1:     // Invalid address
                    case 13:    // Incomplete address
                    case 2:     // POI cannot be found / No CVC data returned
                    case 999:     // SQ Failed
                        if (previousRes == 2 || previousRes == 13 || previousRes === false) {
                            res2Counter += 1;
                        }
                    case 3:     // POI not active / POI not found
                    case 4:     // NBN not ready (former ADSL?)
                    case 14:    // SQ_NOT_SERVICEABLE
                        if (data.Services.fwa_4g === 1 || data.Services.fwa_5g === 1) {
                            msg = "<h4></h4>";
                            action = '';

                            page = hw.getUrl();
                        }
                        else {
                            msg = "<h4>TPG services are not yet available in your area.</h4>";
                            action = 'waitADSL';
                            page = '/nbn#waitlist';
                        }
                        break;
                    case 5:
                    case 7:
                    case 8:
                    default:
                        break;
                }
                // showSQLoading(false);

                if (data.NBN.addr_list !== undefined && res2Counter < 2) {
                    confirmIncompleteAddr(data.NBN.addr_list);
                } else if ((data.NBN.res == 2 || data.NBN.res == 13) && res2Counter < 2) {
                    displaySQModal(false);
                    $('.sq-msg').empty();
                    showAddressForm(function(){ populateAddressForm(data.Address); });
                } else {
                    showSQResult(status, msg, action, page, data);
                    res2Counter = 0;
                }
            }
            previousRes = data.NBN.res;
        }
    }

    /* Address form */

    /* load the form via ajax call */
    function showAddressForm(fn) {
        if(webformSQ){//if webform, show the divided address inputs
            $('input[name=show_sq]').val(0).trigger("change");
            return;
        }
        displaySQModal(false);
        if($('#addressFormModal').find('#addressEntry').length == 0){
            $('#addressFormModal').find(".modal-body").load('/api/sq_modal_content', function (){
                addressFormModalBindEvents();
                if(typeof(fn)==='function') {
                    fn();
                }
            });
        }
        else {
            if(typeof(fn)==='function') {
                fn();
            }
        }
        $('#addressFormModal').modal('show');
    };


    $('.editAddress').on('click', function() {
        qasUnselected($(this).prev('input'));
    });

    /* Bind all the events to elements of SQ address form Modal,
       to be called after the modal content is loaded */
    function addressFormModalBindEvents(){
        $(document).on('change',"#state",function(e) {
            clearAndDisable(this.id);
            if ($("#state").val()) {
                $("#suburb").prop('disabled', false);
            } else {
                $("#suburb").prop('disabled', true);
            }
        });
        $("#suburb").keyup(function() {
            if (!$("#suburb").val()) {
                //disable texts if Suburb is Empty
                $("#addressFormModal input:text:not(#suburb)").prop('disabled', true);
                $("#addressFormModal select:not(#state)").prop('disabled', true);
                $("#street").val("");
                $("#streetType").val("");
                $("#streetNumber").val("");
                $("#unitNumber").val("");
                clearAndDisable(this.id);
            } else {
                $("#street").prop('disabled', false);
                $("#postcode").prop('disabled', false);
            }
        });
        $("#suburb").change(function() {
            clearAndDisable(this.id);
        });
        $("#postcode").change(function() {
            clearAndDisable(this.id);
        });
        $("#street").keyup(function(e) {
            if (!$("#street").val()) {
                //disable texts if Suburb is Empty
                $("#streetType").val("");
                $("#addressFormModal input:text:not(#suburb,#street,#postcode)").prop('disabled', true);
                $("#addressFormModal select:not(#state)").prop('disabled', true);
                // optional info
                clearAndDisable(this.id);
            } else {
                $("#addressFormModal input:text").prop('disabled', false);
                $("#addressFormModal select:not(#state)").prop('disabled', false);
                if ($("#postcode").val().trim() !== '' && $('#checkAvailableSubmit').hasClass('disabled')) {
                    enableButton($('#checkAvailableSubmit'));
                }
            }
        });
        $("#streetType").change(function() {
            $("#addressFormModal input:text").prop('disabled', false);
            $("#addressFormModal select:not(#state)").prop('disabled', false);
        });
        // autocomplete
        $("#suburb").autocomplete({
            source: function(request, response) {
                $("#suburb").addClass('ui-autocomplete-loading');

                $.ajax({
                    url: "/api/address_checker",
                    type: "POST",
                    dataType: "json",
                    data: $("#addressEntry").serialize() + "&searchtype=suburb",
                    success: function(data) {
                        if (data) {
                            response($.map(data.response, function(c) {
                                return {
                                    label: c.label,
                                    value: c.value
                                };
                            }));
                        }
                    },
                    complete: function() {
                        $("#suburb").removeClass('ui-autocomplete-loading');
                    }
                });
            },
            minLength: 1,
            open: function() {
                $('.ui-autocomplete').css('width', $(this).css('width'));
            }
        });
        $("#suburb").autocomplete('widget').off('menufocus hover mouseover mouseenter'); // iOS >= 8.1 fix

        $("#street").autocomplete({
            source: function(request, response) {
                $("#street").addClass('ui-autocomplete-loading');

                $.ajax({
                    url: "/api/address_checker",
                    type: "POST",
                    dataType: "json",
                    data: $("#addressEntry").serialize() + "&searchtype=street",
                    success: function(data) {
                        if (data) {
                            response($.map(data.response, function(c) {
                                return {
                                    label: c.label,
                                    value: c.value,
                                    streettype: c.streettype
                                };
                            }));
                        }
                    },
                    complete: function() {
                        $("#street").removeClass('ui-autocomplete-loading');
                    }
                });
            },
            select: function(event, ui) {
                $("#streetType").val(ui.item.streettype);
                if ($("#postcode").val().trim() !== '' && $('#checkAvailableSubmit').hasClass('disabled')) {
                    enableButton($('#checkAvailableSubmit'));
                }
            },
            minLength: 1,
            open: function() {
                $('.ui-autocomplete').css('width', $(this).css('width'));
            }
        });
        $("#street").autocomplete('widget').off('menufocus hover mouseover mouseenter'); // iOS >= 8.1 fix

        $("#postcode").autocomplete({
            source: function(request, response) {
                $("#postcode").addClass('ui-autocomplete-loading');

                $.ajax({
                    url: "/api/address_checker",
                    type: "POST",
                    dataType: "json",
                    data: $("#addressEntry").serialize() + "&searchtype=postcode",
                    success: function(data) {
                        if (data) {
                            response($.map(data.response, function(c) {
                                return {
                                    label: c.label,
                                    value: c.value
                                };
                            }));
                        }
                    },
                    complete: function() {
                        $("#postcode").removeClass('ui-autocomplete-loading');
                    }
                });
            },
            select: function(event, ui) {
                if ($("#street").val().trim() !== '' && $('#checkAvailableSubmit').hasClass('disabled')) {
                    enableButton($('#checkAvailableSubmit'));
                }
            },
            minLength: 1,
            open: function() {
                $('.ui-autocomplete').css('width', $(this).css('width'));
            }
        });
        $("#postcode").autocomplete('widget').off('menufocus hover mouseover mouseenter'); // iOS >= 8.1 fix

        $('#checkAvailableSubmit').click(function() {
            disableButton($(this));

            // breakdown form submit
            $('#addressFormModal').modal('hide');
            displaySQModal(true);
            // showSQLoading(true);

            $.ajax({
                url: '/api/address_checker',
                type: 'POST',
                dataType: "json",
                timeout: "200000",
                data: $("#addressEntry").serialize() + '&onesq=1&searchtype=sq',
                success: function(data) {
                    postProcessSQResult('success', data, false);
                },
                error: function() {
                    // showSQLoading(false);
                    $(this).text('Check Availability');
                    $(this).closest('.modal').modal('show');
                    postProcessSQResult("error", [], false);
                },
            });
        });
    }

    this.addressFormModalBindEvents = function() {
        return addressFormModalBindEvents();
    }

    function displaySQModal(state) {
        // do nothing if there is no sq modal or request for one
        if (!$('#address').data('splash') || !$('#sqModal').length || webformSQ) {
            return;
        }

        if (state) {
            $('#sqModal').modal('show');
        }
        else {
            $('#sqModal').modal('hide');
        }
    }

    function showSQLoading(state) {
        if (state) {
            $('.sq-result').hide();
            $('.sq-processing').show();
        }
        else {
            $('.sq-processing').hide();
        }
    }

    function qasSelected(element, value) {
        $('#addressRegInt').val(value);
        // chrome blurs input on disable, copy confirmAddr gbl to tmp
        var tmp = confirmAddr,
            addressField = getJQueryObj(element);
        addressField.prop('disabled', true);
        confirmAddr = tmp;
        addressField.parent().addClass('input-group');
        addressField.next('.editAddress').removeClass('hidden');
        if (typeof(qasLockActions) == 'function') {
            qasLockActions($, value);
        }
    }

    function qasUnselected(element) {
        var addressField = getJQueryObj(element);
        addressField.val('').prop('disabled', false);
        addressField.parent().removeClass('input-group');
        addressField.next('.editAddress').addClass('hidden');
        $('#sqSkip').val('false');
        $('#sqSkip').data('res', false);
        if (typeof(qasUnlockActions) == 'function') {
            qasUnlockActions($);
        }
        clearAndDisable('all');
    }

    function getJQueryObj(obj) {
        if (obj instanceof jQuery) {
            return obj;
        }

        return $(obj);
    }

    function disableButton(button) {
        button = getJQueryObj(button);

        if (!button.hasClass('disabled')) {
            button.addClass('disabled');
        }
        button.prop('disabled', true);
    }

    function enableButton(button) {
        button = getJQueryObj(button);

        button.removeClass('disabled');
        button.prop('disabled', false);
    }

    function showSQResult(status, msg, action, page, data) {
        // heres some default elements you can make use of
        showSQLoading(false);
        $('.address-result').text(data.formed_fulladdress);
        $('.nbn-disconnection').hide();

        // for any custom logic simply define the sqActions function in your code
        var show_result = true;
        if (typeof(sqActionsOverride) == 'function') {
            show_result = sqActionsOverride(status, msg, action, page, data);
        } else if (typeof(sqActions) == 'function') {
            if (action === 'noRedirect') {
                if (typeof(msg) == 'object') {
                    var m = msg;
                    var output = '<div class="sq-msg">\n<h2 class="lead">' + m.title + '</h2>\n<p>' + m.body + '</p>\n'
                    + (m.cta ? '<div class="button-wrapper">\n'
                        + m.cta.map(function (btn) {
                            return '<div>\n<a class="clickable btn btn-yframe sq-action ' + btn.class + '" href="' + btn.link + '" ' + btn.attr + '>\n<div class="action-head">' + btn.title + '</div>\n<div class="action-info">' + btn.body + '</div>\n</a>\n</div>\n';
                        }).join('')
                    + '</div>\n' : '')
                + '</div>\n';
                            $('.sq-result .sq-msg').replaceWith(output);
                }
            } else {
				if (typeof(msg) === 'object') {
					var m = '<h4>'+msg.title+'</h4>'+msg.body;
					msg = m;
				}
                show_result = sqActions(status, msg, action, page, data);
            }
        } else {
            // default action
            $('.sq-msg').html(msg);
        }

        if (!show_result) {
            displaySQModal(false);
            return;
        }

        $('.sq-result').show();
    }

    // migrated from web-novus-drupal clearNDisable
    function clearAndDisable(pointOfReset) {
        var toDisable = true;
        var toClear = true;
        var toClearOptional = false;
        var notToDisableText = [];
        var notToDisableSelect = ['#state'];
        switch (pointOfReset) {
            case 'street':
                toDisable = false;
                toClearOptional = true;
                break;
            case 'suburb':
                toClearOptional = true;
                $('#postcode').val("");
                $('#street').val("");
                notToDisableText.push('#suburb');
                notToDisableText.push('#postcode');
                notToDisableText.push('#street');
                break;
            case 'postcode':
                $('#street').val("");
                $('#streetType').val("");
                toClear = false;
                toDisable = false;
                notToDisableText.push('#suburb');
                notToDisableText.push('#postcode');
                notToDisableText.push('#street');
                break;
            case 'state':
                toClearOptional = true;
                $('#suburb').val("");
                $('#streetType').val("");
                $('#street').val("");
                $('#postcode').val("");
                notToDisableText.push('#suburb');
                break;
            case 'all':
                $('#state').val("");
                $('#suburb').val("");
                $('#streetType').val("");
                $('#street').val("");
                $('#postcode').val("");
                break;
        }
        if (toDisable) {
            $("#addressFormModal input:text:not(" + notToDisableText.join() + ")").prop('disabled', 'true');
            $("#addressFormModal select:not(" + notToDisableSelect.join() + ")").prop('disabled', 'true');
        }
        if (toClear) {
            $('#unitTypeCode').val("");
            $('#levelTypeCode').val("");
            $('#streetSuffix').val("");
            $('#streetNumber').val("");
            $('#unitNumber').val("");
            $('#lotNumber').val("");
            $('#levelNumber').val("");
            $('#siteName').val("");
            $('#complexBldgName').val("");
            $('#complexStreetName').val("");
            $('#complexStreetType').val("");
            $('#complexStreetNumber').val("");
            $('#complexStreetSuffix').val("");
        }
        if (toClearOptional){
            $("#addressFormModal select:not(#state)").val("");
            $("#optionalInfo input").val("");
        }
        disableButton($('#checkAvailableSubmit'));
    }

    function populateAddressForm(address) {
        $('.sq-form input, .sq-form select').prop('disabled', false);
        $('#state').val(address.state);
        $('#suburb').val(address.locality);
        if (address.unitNumber !== undefined) {
            $('#unitNumber').val(address.unitNumber);
        }
        if (address.roadNumber2 !== undefined && address.roadNumber2) {
            $('#streetNumber').val(address.roadNumber1 + '-' + address.roadNumber2);
        }
        else {
            $('#streetNumber').val(address.roadNumber1);
        }
        if (address.streetSuffix !== undefined) {
            $('#streetSuffix').val(address.streetSuffix);
        }
        if (address.hasOwnProperty('roadType')) {
            $('#streetType').val(address.roadType.toUpperCase());
        }
        $('#street').val(address.roadName);
        $('#postcode').val(address.postcode);
        enableButton($('#checkAvailableSubmit'));
    }

    this.populateAddressForm = function(address) {
        return populateAddressForm(address);
    }

    function confirmIncompleteAddr(addr_list) {
        // higher priority for incomplete address case for double confirm
        $.each(addr_list, function(idx, addr) {
            var suburb = addr.locality;
            var streetName = addr.roadName;
            var roadName = addr.roadType ? addr.roadType : '';
            var streetNumber = addr.roadNumber1;

            var formed_addr = addr.lotNumber ? 'Lot ' + addr.lotNumber + ', ' : '';
            formed_addr += addr.unitNumber ? addr.unitTypeCode + ' ' + addr.unitNumber + ', ' : '';
            formed_addr += streetNumber ? streetNumber + " " : '';
            formed_addr += streetName + (roadName ? " " + roadName + ", " : ', ');
            formed_addr += suburb + ", ";
            formed_addr += addr.state;
            formed_addr += ' ' + addr.postcode;
            confirmAddr.push({
                'label': formed_addr,
                'value': formed_addr,
                'locid': addr.ID
            });
        });

        confirmAddr.push({
            'label': address_not_found,
            'value': address_not_found,
            'locid': 0
        });
        if(webformSQ) {
            $('input[name="webform-address"]').val('');
            addressFields.autocomplete("option", "minLength", 0);
            addressFields.autocomplete("search", "");
        }else{
            $("#address").autocomplete("option", "minLength", 0);
            $("#address").autocomplete("search", "");
        }


        displaySQModal(false);
        return;
    }

    function getADSLpage(data) {
        var adslRes = 1, page = '/adsl'; // default to /adsl

        if(data.Services.adsl > 0 && data.ADSL.homephone == 'Not Available'){
            adslRes = data.ADSL.adsl2plus !== 'Not Available' ? 2 : 3;
        }

        switch(adslRes) {
            case 2:
                page = '/products_services/adsl2-standalone';
                break;
            case 3:
                page = '/products_services/broadband-offnet';
                break;
            default:
                page = '/adsl';
        }

        return page;
    }

    $('.close').click(function() {
        var thisModal = $(this).closest('.modal');
        if (thisModal.attr('id') == 'addressFormModal') {
            $('#address').focus();
        }

        thisModal.modal('hide');
    });
    $('.sq-modal .modal-dialog').on('click tap', function(e) {
        if ($(e.target).hasClass('modal-dialog')) {
            $('.modal').modal('hide');
        }
    });

    $('.sq-address-input').focus(function () {
        $('#sq-wrapper').addClass('focus');
    }).blur(function () {
        $('#sq-wrapper').removeClass('focus');
    });
    $('#sq-wrapper').on('click', function () {
        $('.sq-address-input').focus();
    });

    $('#sq-modal').on('shown.bs.modal', function() {
        var maxTime = 1000, // 5 seconds
        startTime = Date.now();

        var interval = setInterval(function () {
            if ($('.sq-modal a.btn').is(':visible')) {
                $('.sq-modal a.btn').each(function () {
                    var r = $(this).outerHeight() / 2;
                    $(this).css({'border-radius': r + 'px' });

                });
                clearInterval(interval);
            } else {
                // still hidden
                if (Date.now() - startTime > maxTime) {
                    // hidden even after 'maxTime'. stop checking.
                    clearInterval(interval);
                }
            }
        }, 100); // 0.1 second (wait time between checks)
    });
})(jQuery, sqStorage, sqToggle);
