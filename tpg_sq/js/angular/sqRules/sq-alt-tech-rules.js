var failedSq= {
    isMatched: function (sq) {
        return sq.Services === undefined || sq.Services.length == 0;
    },
    modalView: function () {
        return 'modal-failedSq';
    },
    view: function () {
        return 'failedSq';
    },
    redirectURL: function () {
        return false;
    },
};

var whenNbnIsAvailableWithAltTechs = {
    isMatched: function (sq) {
        return sq.Services.nbn === 1 && sq.NBN.technology !== "Satellite" && (sq.Services.fwa_4g === 1 || sq.Services.fwa_5g === 1 || sq.Services.fttb === 1);
    },
    modalView: function () {
        return 'modal-whenNbnIsAvailableWithAltTechs';
    },
    view: function () {
        return 'whenNbnIsAvailableWithAltTechs';
    },
    redirectURL: function () {
        return false;
    },
};

var whenNoNbnButAltTechsAvailable = {
    isMatched: function (sq) {
        return (sq.Services.nbn !== 1 || sq.NBN.technology === "Satellite") &&
            (sq.Services.fwa_4g === 1 || sq.Services.fwa_5g === 1 || sq.Services.fttb === 1) && (sq.NBN.res !== 3 && sq.NBN.res !== 4 && sq.NBN.res !== 14);
    },
    modalView: function () {
        return 'modal-whenNoNbnButAltTechsAvailable';
    },
    view: function () {
        return 'whenNoNbnButAltTechsAvailable';
    },
    redirectURL: function () {
        return false;
    },
};

var whenFttbIsAvailableWithAltTechs = {
    isHomepage: function() {
      return window.location.pathname === '/';
    },
    isMatched: function (sq) {
        return sq.FTTB.res === 1 && sq.FTTB.technology !== "FTTH";
    },
    modalView: function () {
        return this.isHomepage() ? 'modal-whenFttbRedirect' : 'modal-whenFttbIsAvailableWithAltTechs';
    },
    view: function () {
        return 'whenFttbIsAvailableWithAltTechs';
    },
    redirectURL: function () {
        let fttbUrl =  '/fttb';
        return this.isHomepage() ? fttbUrl : false;
    },
};

var whenFtthIsAvailableWithAltTechs = {
    isMatched: function (sq) {
        return sq.FTTB.res === 1 && sq.FTTB.technology === "FTTH";
    },
    modalView: function () {
        return false;
    },
    view: function () {
        return 'whenFtthIsAvailableWithAltTechs';
    },
    redirectURL: function () {
        return false;
    },
};

var whenNoFttbButAltTechsAvailable  = {
    isMatched: function (sq) {
        return sq.FTTB.technology === "FTTH" || sq.Services.fwa_4g === 1 || sq.Services.fwa_5g === 1 || (sq.Services.nbn === 1 && sq.NBN.technology !== "Satellite");
    },
    modalView: function () {
        return false;
    },
    view: function () {
        return 'whenNoFttbButAltTechsAvailable';
    },
    redirectURL: function () {
        return false;
    },
};

var whenNoFtthButAltTechsAvailable  = {
    isMatched: function (sq) {
        return (sq.FTTB.res === 1 && sq.FTTB.technology !== "FTTH") || sq.Services.fwa_4g === 1 || sq.Services.fwa_5g === 1 || (sq.Services.nbn === 1 && sq.NBN.technology !== "Satellite");
    },
    modalView: function () {
        return false
    },
    view: function () {
        return 'whenNoFtthButAltTechsAvailable';
    },
    redirectURL: function () {
        return false;
    },
};

var whenListOfAltTechsAvailable  = {
    isMatched: function (sq) {
        return  sq.FTTB.res === 1 || sq.Services.fwa_4g === 1 || sq.Services.fwa_5g === 1 || (sq.Services.nbn === 1 && sq.NBN.technology !== "Satellite");
    },
    modalView: function () {
        return 'modal-whenListOfAltTechsAvailable';
    },
    view: function () {
        return 'whenListOfAltTechsAvailable';
    },
    redirectURL: function () {
        return false;
    },
};
