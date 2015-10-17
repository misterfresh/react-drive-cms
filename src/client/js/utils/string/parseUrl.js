'use strict';
var parseUrl = function (views) {
    var url = window.location.href;
    var urlSplit = url.split('/');
    var elementType = 'page';
    var elementId = 0;
    var elementFileId = '';
    var elementPath = '';
    for (var i = 0; i < urlSplit.length; i++) {
        if (urlSplit[i] === 'article') {
            elementType = 'article';
            elementId = urlSplit[i + 1];
            elementFileId = views.articles[elementId]['driveId'];
            break;
        } else if (urlSplit[i] === 'category') {
            elementType = 'category';
            elementId = urlSplit[i + 1];
            break;
        } else if (urlSplit[i] === '#!') {
            elementPath = urlSplit[i + 1];
        }
    }

    return {
        elementType: elementType,
        elementId: elementId,
        elementFileId: elementFileId,
        elementPath: elementPath
    };
};
module.exports = parseUrl;