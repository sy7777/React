function sqToggle() {
    // Remember to enter pages in SQAddressFieldFormatter.php as well for non-dynamic content types
    var availablePages = ['/nbn/high-speed-nbn', '/services/internet-plans', '/nbn', '/', '/ftth', '/fttb', '/fttb_new'];

    function isNewVersionAvailable() {
        return availablePages.filter(function(page) {
            return window.location.pathname === page;
        }).length > 0;
    }

    return {
        isNewVersion: isNewVersionAvailable,
    };
}
