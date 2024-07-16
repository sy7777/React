var whenFttbIsAvailableRedirect = {
    isMatched: function (sq) {
        return sq.FTTB.res === 1 || sq.Services.fttb === 1;
    },
    view: function () {
        return false;
    },
    modalView: function () {
        return 'modal-whenFttbRedirect';
    },
    redirectURL: function () {
        return "/fttb";
    }
};
