'use strict';

var parseHtml = function (inputDoc) {
    var styleStart = '<style type="text/css">';
    var styleEnd = '</style>';
    var splitStyleStart = inputDoc.split(styleStart);
    var splitStyleEnd = splitStyleStart[1].split(styleEnd);

    var htmlStart = '<body ';
    var htmlStart2 = '>';
    var htmlEnd = '</body>';
    var splitHtmlStart = splitStyleEnd[1].split(htmlStart);
    var splitHtmlStart2 = splitHtmlStart[1].split(htmlStart2);
    var htmlClass = splitHtmlStart2[0];
    var htmlStartFull = htmlStart + htmlClass + htmlStart2;
    splitHtmlStart = splitStyleEnd[1].split(htmlStartFull);
    var splitHtmlEnd = splitHtmlStart[1].split(htmlEnd);

    return {
        styles: styleStart + splitStyleEnd[0] + styleEnd,
        html: '<div >' + splitHtmlEnd[0] + '</div>'
    }
};
module.exports = parseHtml;