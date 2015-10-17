'use strict';
var formatDate = function (lastUpdated) {
    var fullDateSplit = lastUpdated.split(' ');
    var dateSplit = fullDateSplit[0].split('/');
    var day = parseInt(dateSplit[0]);
    var month = dateSplit[1];
    var year = dateSplit[2];
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    var daySuffix = 'th';
    switch (day) {
        case 1:
            daySuffix = 'st';
            break;
        case 2:
            daySuffix = 'nd';
            break;
        case 3:
            daySuffix = 'rd';
            break;
    }
    return day + daySuffix + ' of ' + monthNames[(month - 1)] + ' ' + year;
};
module.exports = formatDate;