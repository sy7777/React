function homeWireless(sqResult) {

    var SQResult;
    var urls = {
        'nbn' : '/nbn',
        'fwa_4g': '/home-wireless-broadband',
        'fwa_5g': '/5g-home-broadband'
    };

    function redirectUrl() {
        // RETURN ORDER BY PRECEDENCE
        if (SQResult.Services.nbn === 1) {
            return returnUrlByTech('nbn');
        }
        else if (SQResult.Services.fwa_4g === 1) {
            return returnUrlByTech('fwa_4g');
        }
        else if (SQResult.Services.fwa_5g === 1) {
            return returnUrlByTech('fwa_5g');
        }
    }

    function returnUrlByTech(tech) {
        switch (tech) {
            case 'nbn':
                return urls.nbn;
                break;
            case 'fwa_4g':
                return urls.fwa_4g;
                break;
            case 'fwa_5g':
                return urls.fwa_5g;
                break;
            default:
                return urls.nbn;
        }
    }

    function init(sqResult) {
        SQResult = sqResult;
    }

    init(sqResult);

    return {
        getUrl: redirectUrl
    }
}
