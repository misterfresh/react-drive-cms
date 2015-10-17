'use strict';
var content = require('./../utils/utils').content;
var string = require('./../utils/utils').string;
var noop = function () {
};

var Drive = function (config, $) {
    return {
        callJsonP: function (url, callback) {
            callback = callback || noop;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'jsonp',
                success: function (res, status) {
                    callback(res);
                },
                error: function (res, status, error) {
                    console.log(error);
                }
            });
        },
        call: function (url, callback) {
            callback = callback || noop;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'text',
                success: function (res, status) {
                    callback(res);
                },
                error: function (res, status, error) {
                    console.log(error);
                }
            });
        },
        getSpreadsheet: function (fileId, callback) {
            callback = callback || noop;
            var self = this;
            var sheetUrl = "https://spreadsheets.google.com/feeds/list/" + fileId + "/od6/public/values?alt=json";
            self.callJsonP(sheetUrl, callback);
        },
        getDocument: function (fileId, callback) {
            callback = callback || noop;
            var self = this;
            var docUrl = 'https://docs.google.com/feeds/download/documents/export/Export?id=' + fileId + '&exportFormat=html';
            self.call(docUrl, callback);
        },
        getViews: function (callback) {
            var self = this;
            callback = callback || noop;
            self.getSpreadsheet(config.dashboardId, function (Json) {
                callback(
                    content.extractViews(
                        content.getPosts(Json)
                    )
                );
            });
        },
        init: function (callback) {
            var self = this;
            callback = callback || noop;
            self.getViews(function (views) {
                views.routeParams = string.parseUrl(views);
                views.article = false;
                if (views.routeParams.elementType === 'article') {
                    self.getElementHtml(views.routeParams.elementFileId, function (elementHtml) {
                        var article = views.articles[views.routeParams.elementId];
                        article['body'] = elementHtml;
                        views.article = article;
                        callback(views);
                    })
                } else {
                    callback(views);
                }
            })
        },
        getElementHtml: function (elementId, callback) {
            var self = this;
            self.getDocument(elementId, function (doc) {
                var docHtml = content.parseHtml(doc);
                callback((docHtml.styles + docHtml.html));
            })
        }
    };
};
module.exports = Drive;