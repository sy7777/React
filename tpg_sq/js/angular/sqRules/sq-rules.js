// Generic Rules
var whenNbnIsAvailable = {
    isMatched: function (sq) {
        return sq.Services.nbn === 1 && sq.NBN.technology !== "Satellite";
    },
    view: function () {
        return 'whenNbnIsAvailable';
    },
    modalView: function () {
        return 'modal-whenNbnIsAvailable';
    },
    redirectURL: function () {
        return false;
    }
};

var whenFttbIsAvailable = {
    isMatched: function (sq) {
        return sq.FTTB.res === 1;
    },
    view: function () {
        return 'whenFttbIsAvailable';
    },
    modalView: function () {
        return 'modal-whenFttbIsAvailable';
    },
    redirectURL: function () {
        return false;
    }
};

var when5gIsAvailable = {
    isMatched: function (sq) {
        return sq.Services.fwa_5g === 1;
    },
    view: function () {
        return 'when5gIsAvailable';
    },
    modalView: function () {
        return 'modal-when5gIsAvailable';
    },
    redirectURL: function () {
        return false;
    }
};

var whenHWIsAvailable = {
    isMatched: function (sq) {
        return sq.Services.fwa_4g === 1;
    },
    view: function () {
        return 'whenHWIsAvailable';
    },
    modalView: function () {
        return 'modal-whenHWIsAvailable';
    },
    redirectURL: function () {
        return false;
    }
};

var whenNbnAndHwIsAvailable = {
    isMatched: function (sq) {
        return (sq.Services.nbn === 1 && (sq.NBN.res === 0 || sq.NBN.res === 10) && sq.NBN.technology !== "Wireless") && (sq.Services.fwa_4g === 1 || sq.Services.fwa_5g === 1);
    },
    view: function () {
        return 'whenNbnAndHwIsAvailable';
    },
    modalView: function () {
        return 'modal-whenNbnAndHwIsAvailable';
    },
    redirectURL: function () {
        return false;
    }
};

var whenIncompleteInvalid = {
    counter: 1,
    invalid: false,
    incomplete: false,
    isMatched: function (sq) {
        if (this.counter > 2) {
            this.reset();
        }

        if (sq.NBN.res === 1) {
            this.invalid = true;
            return true;
        }
        if (sq.NBN.res === 3 || sq.NBN.res === 13) {
            this.incomplete = true;
            this.counter++;
            return true;
        }
        return false;
    },
    reset: function () {
        this.invalid = false;
        this.incomplete = false;
        this.counter = 1;
    },
    requireAddressRefinementCheck: function () {
        if (this.invalid) {
            return false;
        }
        if (this.incomplete && this.counter <= 2) {
            return true;
        }
        return false;
    },
    view: function () {
        return 'whenIncompleteInvalid';
    },
    modalView: function () {
        if (!this.requireAddressRefinementCheck()) {
            this.reset();
            return 'modal-whenIncompleteInvalid';
        } else {
            return 'modal-addressRefinementChecker';
        }
    },
    redirectURL: function () {
        return false;
    }
};

var whenNbnIsNotServiceable = {
    isMatched: function (sq) {
        return (sq.NBN.res !== 1 &&
            (sq.NBN.res === 3 || sq.NBN.res === 4 || sq.NBN.res === 14)) || sq.NBN.technology === "Satellite";
    },
    modalView: function () {
        return 'modal-whenNbnIsNotServiceable';
    },
    view: function () {
        return 'whenNbnIsNotServiceable';
    },
    redirectURL: function () {
        return false;
    }
};

// Superfast NBN Page Rules

var whenHighSpeedIsAvailable = {
    isMatched: function (sq) {
        return sq.Services.nbn === 1
            && (sq.NBN.res === 0 || sq.NBN.res === 10)
            && (sq.NBN.nbn250Available === 'Yes' || (sq.NBN.nbn250Available === 'Yes'));
    },
    view: function () {
        return 'whenHighSpeedIsAvailable';
    },
    modalView: function () {
        return 'modal-whenHighSpeedIsAvailable';
    },
    redirectURL: function () {
        return false;
    }
};

var whenHighSpeedIsNotAvailable = {
    isMatched: function (sq) {
        return sq.Services.nbn === 1
            && (sq.NBN.res === 0 || sq.NBN.res === 10)
            && (sq.NBN.nbn250Available !== 'Yes' && (sq.NBN.nbn250Available !== 'Yes'));
    },
    view: function () {
        return 'whenHighSpeedIsNotAvailable';
    },
    modalView: function () {
        return 'modal-whenHighSpeedIsNotAvailable';
    },
    redirectURL: function () {
        return false;
    }
};

var whenNoNbnButHW = {
    isMatched: function (sq) {
        return sq.NBN.res !== 0 && sq.NBN.res !== 3 && sq.NBN.res !== 4 && sq.NBN.res !== 10 && sq.NBN.res !== 12 && sq.NBN.res !== 14 && (sq.Services.fwa_4g === 1 || sq.Services.fwa_5g === 1);
        // This is matching NBN page where it won't show HW is positive if NBN is on the way
    },
    modalView: function () {
        return 'modal-whenNbnIsNotAvailableButHwIsAvailable';
    },
    view: function () {
        return 'whenNbnIsNotAvailableButHwIsAvailable';
    },
    redirectURL: function () {
        return false;
    }
};
