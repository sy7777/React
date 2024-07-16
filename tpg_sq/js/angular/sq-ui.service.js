angular.module('productApp')
    .service('sqUIService', function() {
        var $ = jQuery;
        var common = new TpgProductCommon();

        function emptySqInput() {
            $('#address').val('');
            $('#sq-title').show();
        }

        function showSqModal() {
            $('#sq-modal').modal('show');
        }

        function hideSqModal() {
            $('#sq-modal').modal('hide');
        }

        function showSqResult() {
            $('.sq-result').show();
            $('#sq-title').hide();
        }

        function showRegisterYourInterestModal(modal, updateOnly) {
            common.showRegisterYourInterestModal(modal, updateOnly);
        }

        function bindAddressRefinementEvents() {
            if (typeof addressFormModalBindEvents == 'function') {
                addressFormModalBindEvents();
            }
            else {
                console.error('addressFormModalBindEvents is not function');
            }
        }

        function populateAddress(address) {
            if (typeof populateAddressForm == 'function') {
                populateAddressForm(address);
            }
            else {
                console.error('populateAddressForm is not function');
            }
        }

        return {
            emptySqInput: emptySqInput,
            showSqModal: showSqModal,
            hideSqModal: hideSqModal,
            showSqResult: showSqResult,
            showRegisterYourInterestModal: showRegisterYourInterestModal,
            bindAddressRefinementEvents: bindAddressRefinementEvents,
            populateAddress: populateAddress
        }
    });
