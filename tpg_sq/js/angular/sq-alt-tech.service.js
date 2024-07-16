angular.module('productApp')
    .service('sqAltTech', function () {
            var sqPriority = ["fttb", "fwa_5g", "nbn", "fwa_4g", "nbn_wireless", "ftth"];

            function checkFTTB(sq) {
                return sq.FTTB.technology === "FTTH" ? "ftth" : "fttb";
            }

            function check5GPreorder(sq) {
                return sq.WIRELESS5G.hasOwnProperty("readyForService") ? "fwa_5g_preorder" : "fwa_5g";
            }

            function checkNBN(sq) {
                if (sq.NBN.technology === "Wireless") {
                    return "nbn_wireless";
                } else if (sq.NBN.res === 12) {
                    return "nbn_preorder";
                } else {
                    return "nbn";
                }
            }

            function checkTechnologyBehaviour(tech, sq) {
                switch (tech) {
                    case "fttb":
                        return checkFTTB(sq);
                    case "fwa_5g":
                        return check5GPreorder(sq);
                    case "nbn":
                        return checkNBN(sq);
                    default:
                        return false;
                }
            }

            function compileAltTechs(sq, productPage) {
                const maxTechsToShow = 3;

                let availableTechsFromSq = Object.keys(sq.Services).filter(key => sq.Services[key] === 1);

                return availableTechsFromSq
                  //remove tech in question and not in sqPriority i.e fwa_4g_backup
                  .filter(tech => sqPriority.includes(tech) && tech !== productPage.toLowerCase())
                  //secondary mapping of oneSq Tech Results
                  .map(tech => {
                    let mappedTech = checkTechnologyBehaviour(tech, sq);
                    return mappedTech !== false ? mappedTech : tech;
                  })
                  //sort according to sqPriority
                  .sort( (a,b) => sqPriority.indexOf(a) - sqPriority.indexOf(b) )
                  //display up to maximum allowed tech
                  .slice(0, maxTechsToShow);
            }

            return {
                compileAltTechs: compileAltTechs
            };
        }
    );
